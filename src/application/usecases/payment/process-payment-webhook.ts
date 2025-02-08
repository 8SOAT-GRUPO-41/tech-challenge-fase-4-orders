import type { OrderRepository, PaymentGateway } from '@/application/ports'
import { NotFoundError } from '@/domain/errors'

type Input = {
  gatewayResourceId: string
}

export class ProcessPaymentWebhook {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentGateway: PaymentGateway
  ) {}

  async execute(input: Input) {
    const paymentDetails = await this.paymentGateway.getPaymentDetails(input.gatewayResourceId)
    const order = await this.orderRepository.findById(paymentDetails.orderId)
    if (!order) {
      throw new NotFoundError('Order not found')
    }
    order.setPaymentStatus(paymentDetails.paymentStatus)
    order.pay()
    await this.orderRepository.update(order)
  }
}
