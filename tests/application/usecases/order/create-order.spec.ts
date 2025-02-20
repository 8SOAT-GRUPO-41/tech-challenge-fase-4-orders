import { CreateOrder } from "@/application/usecases/order";
import { Order, Product } from "@/domain/entities";
import { NotFoundError } from "@/domain/errors";
import { ProductCategory } from "@/domain/enums";

describe("CreateOrder UseCase", () => {
  const mockOrderRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockProduct = Product.restore(
    "product-1",
    "Test Product",
    ProductCategory.FOOD,
    10,
    "Description"
  );

  const mockProductGateway = {
    findById: jest.fn().mockResolvedValue(mockProduct),
  };

  const mockCustomerGateway = {
    findById: jest.fn().mockResolvedValue({ id: "customer-1" }),
  };

  const createOrder = new CreateOrder(
    mockOrderRepository,
    mockProductGateway,
    mockCustomerGateway
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new order successfully", async () => {
    const input = {
      customerId: "customer-1",
      products: [{ productId: "product-1", quantity: 2 }],
    };

    const order = await createOrder.execute(input);

    expect(order).toBeInstanceOf(Order);
    expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);
    expect(mockProductGateway.findById).toHaveBeenCalledWith("product-1");
    expect(mockCustomerGateway.findById).toHaveBeenCalledWith("customer-1");
  });

  it("should throw error when customer is not found", async () => {
    mockCustomerGateway.findById.mockResolvedValueOnce(null);

    const input = {
      customerId: "invalid-customer",
      products: [{ productId: "product-1", quantity: 2 }],
    };

    await expect(createOrder.execute(input)).rejects.toThrow(NotFoundError);
  });

  it("should throw error when product is not found", async () => {
    mockProductGateway.findById.mockResolvedValueOnce(null);

    const input = {
      customerId: "customer-1",
      products: [{ productId: "invalid-product", quantity: 2 }],
    };

    await expect(createOrder.execute(input)).rejects.toThrow(NotFoundError);
  });
});
