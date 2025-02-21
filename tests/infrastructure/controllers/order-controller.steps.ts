import { loadFeature, defineFeature } from "jest-cucumber";
import { CreateOrderController } from "@/infrastructure/controllers/order-controller";
import { Order } from "@/domain/entities";
import { HttpStatusCode } from "@/infrastructure/http/helper";
import { NotFoundError } from "@/domain/errors";
import type {
  OrderRepository,
  CustomerGateway,
  ProductGateway,
} from "@/application/ports";
import { CreateOrder } from "@/application/usecases/order";
import type {
  HttpResponse,
  HttpRequest,
} from "@/infrastructure/http/interfaces";

// Adicionando a interface do request
interface CreateOrderInput {
  customerId: string;
  products: Array<{ productId: string; quantity: number }>;
}

const feature = loadFeature("tests/features/create-order.feature");

defineFeature(feature, (test) => {
  let controller: CreateOrderController;
  let createOrder: CreateOrder;
  let mockExecute: jest.SpyInstance;
  let request: HttpRequest<CreateOrderInput>;
  let response: HttpResponse | Error; // Alterando o tipo para aceitar Error

  const mockOrder = {
    toJSON: jest.fn().mockReturnValue({
      orderId: "any_id",
      customerId: "any_customer_id",
      total: 10,
      status: "RECEIVED",
    }),
  } as unknown as Order;

  test("Creating a valid order", ({ given, and, when, then }) => {
    given(
      /^I have a valid order request with customer "(.*)"$/,
      (customerId) => {
        const mockOrderRepository = {} as OrderRepository;
        const mockProductGateway = {} as ProductGateway;
        const mockCustomerGateway = {} as CustomerGateway;
        createOrder = new CreateOrder(
          mockOrderRepository,
          mockProductGateway,
          mockCustomerGateway
        );
        mockExecute = jest
          .spyOn(createOrder, "execute")
          .mockResolvedValue(mockOrder);
        controller = new CreateOrderController(createOrder);

        request = {
          body: {
            customerId,
            products: [],
          },
          query: {},
          params: {},
        };
      }
    );

    and(
      /^the request includes a product "(.*)" with quantity (\d+)$/,
      (productId, quantity) => {
        request.body.products.push({ productId, quantity: Number(quantity) });
      }
    );

    when(/^I try to create the order$/, async () => {
      response = await controller.handle(request);
    });

    then(/^the response should have status code (\d+)$/, (statusCode) => {
      expect((response as HttpResponse).statusCode).toBe(Number(statusCode));
    });

    and(/^the response should contain the created order data$/, () => {
      expect((response as HttpResponse).body).toEqual(mockOrder.toJSON());
    });

    and(
      /^the create order use case should be called with correct parameters$/,
      () => {
        expect(mockExecute).toHaveBeenCalledWith(request.body);
      }
    );
  });

  test("Creating an order with invalid customer", ({
    given,
    and,
    when,
    then,
  }) => {
    given(
      /^I have an invalid order request with customer "(.*)"$/,
      (customerId) => {
        const mockOrderRepository = {} as OrderRepository;
        const mockProductGateway = {} as ProductGateway;
        const mockCustomerGateway = {} as CustomerGateway;
        createOrder = new CreateOrder(
          mockOrderRepository,
          mockProductGateway,
          mockCustomerGateway
        );
        mockExecute = jest
          .spyOn(createOrder, "execute")
          .mockRejectedValue(new NotFoundError("Customer not found"));
        controller = new CreateOrderController(createOrder);

        request = {
          body: {
            customerId,
            products: [],
          },
          query: {},
          params: {},
        };
      }
    );

    and(
      /^the request includes a product "(.*)" with quantity (\d+)$/,
      (productId, quantity) => {
        request.body.products.push({ productId, quantity: Number(quantity) });
      }
    );

    when(/^I try to create the order$/, async () => {
      try {
        await controller.handle(request);
      } catch (error) {
        response = error as Error;
      }
    });

    then(/^it should throw a NotFoundError with message "(.*)"$/, (message) => {
      expect(response).toBeInstanceOf(NotFoundError);
      expect((response as Error).message).toBe(message);
    });
  });
});
