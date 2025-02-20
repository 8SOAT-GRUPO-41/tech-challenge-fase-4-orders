import {
  CreateOrderController,
  LoadOrdersController,
  LoadOrderByIdController,
} from "@/infrastructure/controllers/order-controller";
import { Order } from "@/domain/entities";
import { HttpStatusCode } from "@/infrastructure/http/helper";
import { NotFoundError } from "@/domain/errors";
import {
  type OrderRepository,
  type CustomerGateway,
  type ProductGateway,
} from "@/application/ports";
import {
  CreateOrder,
  LoadOrders,
  LoadOrderById,
} from "@/application/usecases/order";

describe("Order Controllers", () => {
  const mockOrder = {
    toJSON: jest.fn().mockReturnValue({
      orderId: "any_id",
      customerId: "any_customer_id",
      total: 10,
      status: "RECEIVED",
    }),
  } as unknown as Order;

  describe("CreateOrderController", () => {
    const mockOrderRepository = {} as OrderRepository;
    const mockProductGateway = {} as ProductGateway;
    const mockCustomerGateway = {} as CustomerGateway;
    const createOrder = new CreateOrder(
      mockOrderRepository,
      mockProductGateway,
      mockCustomerGateway
    );
    const mockExecute = jest
      .spyOn(createOrder, "execute")
      .mockResolvedValue(mockOrder);
    const controller = new CreateOrderController(createOrder);

    it("should return 201 on success", async () => {
      const request = {
        body: {
          customerId: "any_customer_id",
          products: [{ productId: "any_product_id", quantity: 1 }],
        },
        query: {},
        params: {},
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(HttpStatusCode.CREATED);
      expect(response.body).toEqual(mockOrder.toJSON());
      expect(mockExecute).toHaveBeenCalledWith(request.body);
    });
  });

  describe("LoadOrdersController", () => {
    const mockOrderRepository = {} as OrderRepository;
    const loadOrders = new LoadOrders(mockOrderRepository);
    const mockExecute = jest
      .spyOn(loadOrders, "execute")
      .mockResolvedValue([mockOrder]);
    const controller = new LoadOrdersController(loadOrders);

    it("should return 200 on success", async () => {
      const request = {
        body: {},
        query: {},
        params: {},
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual([mockOrder.toJSON()]);
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe("LoadOrderByIdController", () => {
    const mockOrderRepository = {} as OrderRepository;
    const loadOrderById = new LoadOrderById(mockOrderRepository);
    const mockExecute = jest
      .spyOn(loadOrderById, "execute")
      .mockResolvedValue(mockOrder);
    const controller = new LoadOrderByIdController(loadOrderById);

    it("should return 200 on success", async () => {
      const request = {
        body: {},
        query: {},
        params: { orderId: "any_id" },
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual(mockOrder.toJSON());
      expect(mockExecute).toHaveBeenCalledWith("any_id");
    });

    it("should throw NotFoundError when order is not found", async () => {
      const request = {
        body: {},
        query: {},
        params: { orderId: "any_id" },
      };

      mockExecute.mockRejectedValueOnce(new NotFoundError("Order not found"));

      await expect(controller.handle(request)).rejects.toThrow(
        new NotFoundError("Order not found")
      );
    });
  });
});
