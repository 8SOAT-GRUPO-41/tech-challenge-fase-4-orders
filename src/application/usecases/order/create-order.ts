import type { CustomerGateway, OrderRepository, ProductGateway } from '@/application/ports'
import { Order, OrderItem } from '@/domain/entities'
import { NotFoundError } from '@/domain/errors'

type Input = {
  customerId: string
  products: { productId: string; quantity: number }[]
}

export class CreateOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productGateway: ProductGateway,
    private readonly customerGateway: CustomerGateway
  ) {}

  async execute(params: Input): Promise<Order> {
    const { customerId, products } = params
    const customer = await this.customerGateway.findById(customerId)
    if (!customer) {
      throw new NotFoundError('Customer not found')
    }
    const orderItems = await Promise.all(
      products.map(async ({ productId, quantity }) => {
        const product = await this.productGateway.findById(productId)
        if (!product) {
          throw new NotFoundError('Product not found')
        }
        return OrderItem.restore(productId, quantity, product.getPrice())
      })
    )
    const order = Order.create(customerId, orderItems)
    await this.orderRepository.save(order)
    return order
  }
}
