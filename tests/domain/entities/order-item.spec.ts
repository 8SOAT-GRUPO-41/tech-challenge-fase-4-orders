import { OrderItem } from "@/domain/entities/order-item";

describe("OrderItem Entity", () => {
  const validProductId = "product-1";
  const validQuantity = 2;
  const basePrice = 20; // Preço base antes da multiplicação
  const expectedPrice = basePrice * validQuantity; // Preço após multiplicação interna

  it("should create a new order item", () => {
    const orderItem = OrderItem.restore(
      validProductId,
      validQuantity,
      basePrice
    );
    expect(orderItem.productId).toBe(validProductId);
    expect(orderItem.getQuantity()).toBe(validQuantity);
    expect(orderItem.getPrice()).toBe(expectedPrice); // Agora espera o preço multiplicado
  });

  it("should convert to JSON correctly", () => {
    const orderItem = OrderItem.restore(
      validProductId,
      validQuantity,
      basePrice
    );
    const json = orderItem.toJSON();
    expect(json).toEqual({
      productId: validProductId,
      quantity: validQuantity,
      price: expectedPrice, // Agora espera o preço multiplicado
    });
  });
});
