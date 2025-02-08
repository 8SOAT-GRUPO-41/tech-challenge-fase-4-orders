import type { OrderRepository } from '@/application/ports'
import type { Order } from '@/domain/entities'
import { NotFoundError } from '@/domain/errors'

export class LoadOrderById {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      throw new NotFoundError('Order not found')
    }
    return order
  }
}
