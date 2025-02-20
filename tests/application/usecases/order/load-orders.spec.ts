import { LoadOrders } from "@/application/usecases/order";
import { Order, OrderItem } from "@/domain/entities";

describe("LoadOrders UseCase", () => {
  const mockOrders = [
    Order.create("customer-1", [OrderItem.restore("product-1", 2, 10)]),
    Order.create("customer-2", [OrderItem.restore("product-2", 1, 20)]),
  ];

  const mockOrderRepository = {
    save: jest.fn(),
    findAll: jest.fn().mockResolvedValue(mockOrders),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const loadOrders = new LoadOrders(mockOrderRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load all orders successfully", async () => {
    const orders = await loadOrders.execute();
    expect(orders).toBe(mockOrders);
    expect(mockOrderRepository.findAll).toHaveBeenCalled();
  });
});
