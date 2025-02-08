import type { OrderRepository } from '@/application/ports'
import type { Order } from '@/domain/entities'
import { OrderStatus } from '@/domain/enums'
import { NotFoundError } from '@/domain/errors'

type Input = {
  orderId: string
  status: OrderStatus
}

export class UpdateOrderStatus {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: Input): Promise<Order> {
    const { orderId, status } = input
    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      throw new NotFoundError('Order not found')
    }
    switch (status) {
      case OrderStatus.PAID:
        order.pay()
        break
      case OrderStatus.RECEIVED:
        order.receive()
        break
      case OrderStatus.IN_PREPARATION:
        order.prepare()
        break
      case OrderStatus.READY:
        order.ready()
        break
      case OrderStatus.COMPLETED:
        order.complete()
        break
    }
    await this.orderRepository.updateOrderStatus(order)
    return order
  }
}
