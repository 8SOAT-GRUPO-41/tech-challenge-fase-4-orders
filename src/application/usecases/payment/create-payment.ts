import type { OrderRepository, PaymentGateway } from '@/application/ports'
import { NotFoundError } from '@/domain/errors'

type Input = {
  orderId: string
}

export class CreatePayment {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentGateway: PaymentGateway
  ) {}

  async execute(input: Input) {
    const order = await this.orderRepository.findById(input.orderId)
    if (!order) {
      throw new NotFoundError('Order not found')
    }
    const qrCode = await this.paymentGateway.generatePaymentQRCode({
      orderId: order.orderId,
      totalAmount: order.getTotal()
    })
    return qrCode
  }
}
