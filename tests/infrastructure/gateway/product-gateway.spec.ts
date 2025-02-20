import { ProductGatewayMS } from "@/infrastructure/gateway/product-gateway";
import { ProductCategory } from "@/domain/enums";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProductGateway", () => {
  const mockProductData = {
    product_id: "product-1",
    name: "Test Product",
    category: ProductCategory.FOOD,
    price: "10.00",
    description: "Test Description",
  };

  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockProductData }),
    } as any);
  });

  it("should find product by id", async () => {
    const gateway = new ProductGatewayMS();
    const product = await gateway.findById("product-1");
    expect(product).toBeDefined();
    expect(product?.productId).toBe(mockProductData.product_id);
    expect(product?.getPrice()).toBe(10);
  });

  it("should return null when product is not found", async () => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue({ response: { status: 404 } }),
    } as any);

    const gateway = new ProductGatewayMS();
    const product = await gateway.findById("non-existent");
    expect(product).toBeNull();
  });

  it("should propagate other errors", async () => {
    const error = new Error("Network error");
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue(error),
    } as any);

    const gateway = new ProductGatewayMS();
    await expect(gateway.findById("product-1")).rejects.toThrow(error);
  });
});
