import { OrderItemQuantity } from "@/domain/value-objects";
import { InvalidParamError } from "@/domain/errors";

describe("OrderItemQuantity Value Object", () => {
  it("should create a valid quantity", () => {
    const quantity = new OrderItemQuantity(5);
    expect(quantity.getValue()).toBe(5);
  });

  it("should throw error for zero quantity", () => {
    expect(() => new OrderItemQuantity(0)).toThrow(InvalidParamError);
  });

  it("should throw error for negative quantity", () => {
    expect(() => new OrderItemQuantity(-1)).toThrow(InvalidParamError);
  });
});
