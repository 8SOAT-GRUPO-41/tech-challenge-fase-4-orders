import type { CustomerRepository, OrderRepository, ProductRepository } from '@/application/ports'
import { Order, OrderItem } from '@/domain/entities'
import { NotFoundError } from '@/domain/errors'

type Input = {
  customerId: string
  products: { productId: string; quantity: number }[]
}

export class CreateOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly customerRepository: CustomerRepository
  ) {}

  async execute(params: Input): Promise<Order> {
    const { customerId, products } = params
    const customer = await this.customerRepository.findById(customerId)
    if (!customer) {
      throw new NotFoundError('Customer not found')
    }
    const orderItems = await Promise.all(
      products.map(async ({ productId, quantity }) => {
        const product = await this.productRepository.findById(productId)
        if (!product) {
          throw new NotFoundError('Product not found')
        }
        return OrderItem.create(product, quantity)
      })
    )
    const order = Order.create(customer, orderItems)
    await this.orderRepository.save(order)
    return order
  }
}
