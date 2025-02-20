import { Product } from "@/domain/entities";
import { ProductCategory } from "@/domain/enums";

describe("Product Entity", () => {
  const validProductId = "product-1";
  const validName = "Test Product";
  const validCategory = ProductCategory.FOOD;
  const validPrice = 10;
  const validDescription = "Test Description";

  it("should create a new product", () => {
    const product = Product.create(
      validName,
      validCategory,
      validPrice,
      validDescription
    );
    expect(product.productId).toBeDefined();
    expect(product.getName()).toBe(validName);
    expect(product.getCategory()).toBe(validCategory);
    expect(product.getPrice()).toBe(validPrice);
    expect(product.getDescription()).toBe(validDescription);
  });

  it("should restore a product", () => {
    const product = Product.restore(
      validProductId,
      validName,
      validCategory,
      validPrice,
      validDescription
    );
    expect(product.productId).toBe(validProductId);
    expect(product.getName()).toBe(validName);
    expect(product.getCategory()).toBe(validCategory);
    expect(product.getPrice()).toBe(validPrice);
    expect(product.getDescription()).toBe(validDescription);
  });

  it("should update product name", () => {
    const product = Product.create(
      validName,
      validCategory,
      validPrice,
      validDescription
    );
    const newName = "New Name";
    product.setName(newName);
    expect(product.getName()).toBe(newName);
  });

  it("should update product description", () => {
    const product = Product.create(
      validName,
      validCategory,
      validPrice,
      validDescription
    );
    const newDescription = "New Description";
    product.setDescription(newDescription);
    expect(product.getDescription()).toBe(newDescription);
  });

  it("should convert to JSON correctly", () => {
    const product = Product.create(
      validName,
      validCategory,
      validPrice,
      validDescription
    );
    const json = product.toJSON();
    expect(json).toEqual({
      productId: product.productId,
      name: validName,
      category: validCategory,
      price: validPrice,
      description: validDescription,
    });
  });
});
