import { customerSchema } from './customer'
import { orderItemSchema } from './order-item'

export const orderSchema = {
  type: 'object',
  properties: {
    orderId: { type: 'string', format: 'uuid' },
    status: { type: 'string', examples: ['RECEIVED'] },
    total: { type: 'number', examples: [9] },
    customer: customerSchema,
    orderItems: {
      type: 'array',
      items: orderItemSchema
    },
    paymentStatus: { type: 'string', examples: ['PENDING'] },
    orderDate: { type: 'string', format: 'date-time' }
  }
}
