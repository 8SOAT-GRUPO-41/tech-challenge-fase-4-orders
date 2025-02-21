import type { OrderRepository } from "@/application/ports";
import { NotFoundError } from "@/domain/errors";

export class UpdateOrderStatus {
  constructor(private readonly orderRepository: OrderRepository) {}
  async execute(orderId: string, status: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundError("Order not found");
    order.setStatus(status);
    await this.orderRepository.update(order);
  }
}
