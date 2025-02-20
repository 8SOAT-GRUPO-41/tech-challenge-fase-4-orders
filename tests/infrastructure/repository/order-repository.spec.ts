import { OrderRepositoryDatabase } from "@/infrastructure/repository";
import { Order, OrderItem } from "@/domain/entities";
import { OrderStatus } from "@/domain/enums";

describe("OrderRepository", () => {
  const mockDatabaseConnection = {
    query: jest.fn(),
    transaction: jest.fn(),
  };

  const repository = new OrderRepositoryDatabase(mockDatabaseConnection);
  const mockOrder = Order.create("customer-1", [
    OrderItem.restore("product-1", 2, 10),
  ]);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("update", () => {
    it("should update order status successfully", async () => {
      mockDatabaseConnection.query.mockResolvedValueOnce([]);

      await repository.update(mockOrder);

      expect(mockDatabaseConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE orders SET status"),
        [mockOrder.getStatus(), mockOrder.orderId]
      );
    });

    it("should handle update errors", async () => {
      const error = new Error("Database error");
      mockDatabaseConnection.query.mockRejectedValueOnce(error);

      await expect(repository.update(mockOrder)).rejects.toThrow(error);
    });
  });

  describe("save", () => {
    it("should handle transaction errors", async () => {
      const error = new Error("Transaction error");
      mockDatabaseConnection.transaction.mockRejectedValueOnce(error);

      await expect(repository.save(mockOrder)).rejects.toThrow(error);
    });

    it("should save order successfully", async () => {
      const mockTransactionClient = {
        query: jest.fn().mockResolvedValue({ rows: [{ id: 1 }] }),
      };

      mockDatabaseConnection.transaction.mockImplementation(
        async (callback) => {
          return callback(mockTransactionClient);
        }
      );

      await repository.save(mockOrder);

      expect(mockTransactionClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO orders"),
        expect.any(Array)
      );

      expect(mockTransactionClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO order_products"),
        expect.any(Array)
      );
    });
  });

  describe("findById", () => {
    it("should return order when found", async () => {
      const mockQueryResult = [
        {
          order_id: mockOrder.orderId,
          customer_id: mockOrder.customerId,
          status: OrderStatus.AWAITING_PAYMENT,
          created_at: new Date().toISOString(),
          total: "20",
          products: [
            {
              product_id: "product-1",
              quantity: 2,
              price: "10",
            },
          ],
        },
      ];

      mockDatabaseConnection.query.mockResolvedValueOnce(mockQueryResult);

      const result = await repository.findById(mockOrder.orderId);

      expect(result).toBeInstanceOf(Order);
      expect(result?.orderId).toBe(mockOrder.orderId);
    });

    it("should return null when order is not found", async () => {
      mockDatabaseConnection.query.mockResolvedValueOnce([]);

      const result = await repository.findById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all orders", async () => {
      const mockQueryResult = [
        {
          order_id: mockOrder.orderId,
          customer_id: mockOrder.customerId,
          status: mockOrder.getStatus(),
          total: mockOrder.getTotal().toString(),
          created_at: new Date(),
          products: [
            {
              product_id: "product-1",
              quantity: 2,
              price: "10",
            },
          ],
        },
      ];

      mockDatabaseConnection.query.mockResolvedValueOnce(mockQueryResult);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Order);
      expect(mockDatabaseConnection.query).toHaveBeenCalled();
    });

    it("should return empty array when no orders exist", async () => {
      mockDatabaseConnection.query.mockResolvedValueOnce([]);
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });
  });
});
