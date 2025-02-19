import { productSchema } from './product'

export const orderItemSchema = {
  type: 'object',
  properties: {
    productId: { type: 'string', format: 'uuid' },
    quantity: { type: 'number', examples: [1] },
    price: { type: 'number', examples: [9] }
  }
}
