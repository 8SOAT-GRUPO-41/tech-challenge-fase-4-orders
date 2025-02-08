import { InvalidParamError } from '../errors/invalid-param-error'

export class OrderItemQuantity {
  constructor(private readonly quantity: number) {
    if (quantity <= 0) {
      throw new InvalidParamError('Order item quantity must be greater than 0')
    }
  }

  getValue(): number {
    return this.quantity
  }
}
