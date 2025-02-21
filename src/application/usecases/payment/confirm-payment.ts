import type { PaymentRepository, OrdersGateway } from "@/application/ports";

export class ConfirmPayment {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly ordersGateway: OrdersGateway
  ) {}
  async execute(paymentId: string): Promise<void> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    payment.setStatus("PAID");
    await this.paymentRepository.update(payment);
    await this.ordersGateway.updateOrderStatus(payment.orderId, "PAID");
  }
}
