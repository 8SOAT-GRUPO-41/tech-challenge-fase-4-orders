import { Price } from "@/domain/value-objects";
import { InvalidParamError } from "@/domain/errors";

describe("Price Value Object", () => {
  it("should create a valid price", () => {
    const price = new Price(100);
    expect(price.getValue()).toBe(100);
  });

  it("should throw error for negative price", () => {
    expect(() => new Price(-1)).toThrow(InvalidParamError);
  });

  it("should apply discount correctly", () => {
    const price = new Price(100);
    const discountedPrice = price.applyDiscountPercentage(0.1);
    expect(discountedPrice.getValue()).toBe(90);
  });

  it("should throw error for invalid discount percentage", () => {
    const price = new Price(100);
    expect(() => price.applyDiscountPercentage(-0.1)).toThrow(
      InvalidParamError
    );
    expect(() => price.applyDiscountPercentage(1.1)).toThrow(InvalidParamError);
  });
});
