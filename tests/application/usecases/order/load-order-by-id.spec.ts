import { LoadOrderById } from "@/application/usecases/order";
import { Order, OrderItem } from "@/domain/entities";
import { NotFoundError } from "@/domain/errors";

describe("LoadOrderById UseCase", () => {
  const mockOrder = Order.create("customer-1", [
    OrderItem.restore("product-1", 2, 10),
  ]);
  const mockOrderRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(mockOrder),
    update: jest.fn(),
  };

  const loadOrderById = new LoadOrderById(mockOrderRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load order by id successfully", async () => {
    const order = await loadOrderById.execute(mockOrder.orderId);
    expect(order).toBe(mockOrder);
    expect(mockOrderRepository.findById).toHaveBeenCalledWith(
      mockOrder.orderId
    );
  });

  it("should throw NotFoundError when order does not exist", async () => {
    mockOrderRepository.findById.mockResolvedValueOnce(null);
    await expect(loadOrderById.execute("non-existent")).rejects.toThrow(
      NotFoundError
    );
  });
});
