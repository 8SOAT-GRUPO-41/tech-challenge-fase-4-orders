export class OrderItem {
  private constructor(
    readonly productId: string,
    private quantity: number,
    private price: number
  ) {}

  static restore(productId: string, quantity: number, price: number): OrderItem {
    const total = quantity * price
    return new OrderItem(productId, quantity, total)
  }

  getProductId() {
    return this.productId
  }

  getQuantity() {
    return this.quantity
  }

  getPrice() {
    return this.price
  }

  toJSON() {
    return {
      productId: this.productId,
      quantity: this.quantity,
      price: this.price
    }
  }
}
