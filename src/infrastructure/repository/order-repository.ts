import type { OrderRepository } from '@/application/ports/order-repository'
import { Order } from '@/domain/entities'
import { OrderItem } from '@/domain/entities/order-item'
import type { PaymentStatus, OrderStatus } from '@/domain/enums'
import type { DatabaseConnection } from '@/infrastructure/database/database-connection'

interface OrderQueryResult {
  order_id: string
  payment_status: PaymentStatus
  status: OrderStatus
  created_at: string
  customer_id: string
  total: string
  products: Array<{
    product_id: string
    quantity: number
    price: string
  }>
}

export class OrderRepositoryDatabase implements OrderRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  async findAll(): Promise<Order[]> {
    const sql = `
      SELECT
        o.order_id,
        o.status,
        o.created_at,
        o.customer_id,
        o.total,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'product_id', op.product_id,
            'quantity', op.quantity,
            'price', op.price
          )
        ) AS products
      FROM orders o
      JOIN order_products op ON o.order_id = op.order_id
      GROUP BY o.order_id, o.status, o.created_at, o.customer_id, o.total
      ORDER BY o.order_id;
    `
    const rows = await this.databaseConnection.query<OrderQueryResult>(sql)
    return rows.map((row) => {
      const orderItems = row.products.map((product) => {
        return OrderItem.restore(product.product_id, product.quantity, +product.price)
      })
      const order = Order.restore(row.order_id, row.customer_id, orderItems, row.status, new Date(row.created_at))
      return order
    })
  }

  async save(order: Order): Promise<void> {
    await this.databaseConnection.transaction(async (client) => {
      const insertOrdersQuery = `
        INSERT INTO orders (order_id, customer_id, total, status)
        VALUES ($1, $2, $3, $4)
      `
      await client.query(insertOrdersQuery, [order.orderId, order.customerId, order.getTotal(), order.getStatus()])

      const orderItems = order.getOrderItems()
      const values: string[] = []
      const queryParams: unknown[] = []
      orderItems.forEach((item, index) => {
        const startIndex = index * 4 + 1
        values.push(`($${startIndex}, $${startIndex + 1}, $${startIndex + 2}, $${startIndex + 3})`)
        queryParams.push(order.orderId, item.getProductId(), item.getQuantity(), item.getPrice())
      })
      const insertOrderProductsQuery = `
        INSERT INTO order_products (order_id, product_id, quantity, price)
        VALUES ${values.join(', ')}
      `
      await client.query(insertOrderProductsQuery, queryParams)
    })
  }

  async update(order: Order): Promise<void> {
    const updateOrderSql = `
      UPDATE orders SET status = $1 WHERE order_id = $2
    `
    const updateOrderParams = [order.getStatus(), order.orderId]
    await this.databaseConnection.query(updateOrderSql, updateOrderParams)
  }

  async findById(orderId: string): Promise<Order | null> {
    const sql = `
      SELECT
        o.order_id,
        o.status,
        o.created_at,
        o.customer_id,
        o.total,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'product_id', op.product_id,
            'quantity', op.quantity,
            'price', op.price
          )
        ) AS products
      FROM orders o
      JOIN order_products op ON o.order_id = op.order_id
      WHERE o.order_id = $1
      GROUP BY o.order_id, o.status, o.created_at, o.customer_id, o.total
    `
    const params = [orderId]
    const rows = await this.databaseConnection.query<OrderQueryResult>(sql, params)
    const row = rows.shift()
    if (!row) {
      return null
    }
    const orderItems = row.products.map((product) =>
      OrderItem.restore(product.product_id, product.quantity, +product.price)
    )
    const order = Order.restore(row.order_id, row.customer_id, orderItems, row.status, new Date(row.created_at))
    return order
  }
}
