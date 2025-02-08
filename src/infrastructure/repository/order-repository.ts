import type { OrderRepository } from '@/application/ports/order-repository'
import { Customer, Order, Product } from '@/domain/entities'
import { OrderItem } from '@/domain/entities/order-item'
import type { PaymentStatus, OrderStatus, ProductCategory } from '@/domain/enums'
import type { DatabaseConnection } from '@/infrastructure/database/database-connection'

interface OrderQueryResult {
  order_id: string
  payment_status: PaymentStatus
  status: OrderStatus
  created_at: string
  customer_id: string
  customer_name: string
  email: string
  cpf: string
  products: Array<{
    product_id: string
    product_name: string
    category: ProductCategory
    description: string
    item_price: string
    quantity: number
  }>
}

export class OrderRepositoryDatabase implements OrderRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  async findAll(): Promise<Order[]> {
    const sql = `
      SELECT
        o.order_id,
        o.status,
        o.payment_status,
        o.created_at,
        c.customer_id,
        c.name AS customer_name,
        c.email,
        c.cpf,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'product_id', p.product_id,
            'product_name', p.name,
            'category', p.category,
            'description', p.description,
            'item_price', p.price,
            'quantity', op.quantity
          )
        ) AS products
      FROM
        orders o
      JOIN 
        customers c ON o.customer_id = c.customer_id
      JOIN 
        order_products op ON o.order_id = op.order_id
      JOIN 
        products p ON op.product_id = p.product_id
      GROUP BY
        o.order_id, c.customer_id, o.status, o.created_at, c.name, c.email, c.cpf
      ORDER BY
        o.order_id;`
    const rows = await this.databaseConnection.query<OrderQueryResult>(sql)
    return rows.map((row) => {
      const orderItems = row.products.map((product) => {
        const orderItem = OrderItem.restore(
          Product.restore(
            product.product_id,
            product.product_name,
            product.category,
            +product.item_price,
            product.description
          ),
          product.quantity
        )
        return orderItem
      })
      const order = Order.restore(
        row.order_id,
        Customer.restore(row.customer_id, row.cpf, row.customer_name, row.email),
        orderItems,
        row.status,
        row.payment_status,
        new Date(row.created_at)
      )
      return order
    })
  }

  async save(order: Order): Promise<void> {
    await this.databaseConnection.transaction(async (client) => {
      const insertOrdersQuery =
        'INSERT INTO orders (order_id, customer_id, total, status, payment_status) VALUES ($1, $2, $3, $4, $5)'
      await client.query(insertOrdersQuery, [
        order.orderId,
        order.getCustomer().customerId,
        order.getTotal(),
        order.getStatus(),
        order.getPaymentStatus()
      ])
      const orderItems = order.getOrderItems()
      const values: string[] = []
      const queryParams: unknown[] = []
      orderItems.forEach((item, index) => {
        const startIndex = index * 4 + 1
        values.push(`($${startIndex}, $${startIndex + 1}, $${startIndex + 2}, $${startIndex + 3})`)
        queryParams.push(order.orderId, item.getProduct().productId, item.getQuantity(), item.getPrice())
      })
      const insertOrderProductsQuery = `INSERT INTO order_products (order_id, product_id, quantity, price) VALUES ${values.join(
        ', '
      )}`
      await client.query(insertOrderProductsQuery, queryParams)
    })
  }

  async update(order: Order): Promise<void> {
    const updateOrderSql = 'UPDATE orders SET status = $1, payment_status = $2 WHERE order_id = $3'
    const updateOrderParams = [order.getStatus(), order.getPaymentStatus(), order.orderId]
    await this.databaseConnection.query(updateOrderSql, updateOrderParams)
  }

  async updateOrderStatus(order: Order): Promise<void> {
    const sql = 'UPDATE orders SET status = $1 WHERE order_id = $2'
    const params = [order.getStatus(), order.orderId]

    await this.databaseConnection.query(sql, params)
  }

  async findById(orderId: string): Promise<Order | null> {
    const sql = `
      SELECT
        o.order_id,
        o.status,
        o.payment_status,
        o.created_at,
        c.customer_id,
        c.name AS customer_name,
        c.email,
        c.cpf,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'product_id', p.product_id,
            'product_name', p.name,
            'category', p.category,
            'description', p.description,
            'item_price', p.price,
            'quantity', op.quantity
          )
        ) AS products
      FROM
        orders o
      JOIN 
        customers c ON o.customer_id = c.customer_id
      JOIN 
        order_products op ON o.order_id = op.order_id
      JOIN 
        products p ON op.product_id = p.product_id
      WHERE
        o.order_id = $1
      GROUP BY
        o.order_id, c.customer_id, o.status, o.created_at, c.name, c.email, c.cpf`
    const params = [orderId]
    const rows = await this.databaseConnection.query<OrderQueryResult>(sql, params)
    const row = rows.shift()
    if (!row) {
      return null
    }

    const orderItems = row.products.map((product) => {
      const orderItem = OrderItem.restore(
        Product.restore(
          product.product_id,
          product.product_name,
          product.category,
          +product.item_price,
          product.description
        ),
        product.quantity
      )
      return orderItem
    })
    const order = Order.restore(
      row.order_id,
      Customer.restore(row.customer_id, row.cpf, row.customer_name, row.email),
      orderItems,
      row.status,
      row.payment_status,
      new Date(row.created_at)
    )
    return order
  }
}
