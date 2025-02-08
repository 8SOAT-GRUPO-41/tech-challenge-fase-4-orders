import { productSchema } from './product'

export const orderItemSchema = {
  type: 'object',
  properties: {
    product: productSchema,
    quantity: { type: 'number', examples: [1] },
    price: { type: 'number', examples: [9] }
  }
}
