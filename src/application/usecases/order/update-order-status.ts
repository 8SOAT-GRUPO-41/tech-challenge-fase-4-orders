import type { OrderRepository } from '@/application/ports'
import type { OrderStatus } from '@/domain/enums'

type Input = {
  orderId: string
  status: OrderStatus
}

export interface IUpdateOrderStatus {
  execute(data: Input): Promise<void>
}

export class UpdateOrderStatus implements IUpdateOrderStatus {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(data: Input): Promise<void> {
    const order = await this.orderRepository.findById(data.orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    order.transitionTo(data.status)
    await this.orderRepository.update(order)
  }
}
