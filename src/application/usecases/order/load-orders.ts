import type { OrderRepository } from '@/application/ports'
import type { Order } from '@/domain/entities'

export class LoadOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll()
  }
}
