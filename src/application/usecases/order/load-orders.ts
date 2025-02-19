import type { OrderRepository } from '@/application/ports'
import type { Order } from '@/domain/entities'

export class LoadOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<Order[]> {
    const orders = await this.orderRepository.findAll()
    return orders
  }
}
