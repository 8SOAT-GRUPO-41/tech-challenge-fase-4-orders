import { Order, OrderItem } from "@/domain/entities";
import { OrderStatus } from "@/domain/enums";
import { DomainError } from "@/domain/errors";

describe("Order Entity", () => {
  const mockOrderItems = [
    OrderItem.restore("product-1", 2, 10),
    OrderItem.restore("product-2", 1, 20),
  ];

  it("should create a new order", () => {
    const customerId = "customer-1";
    const order = Order.create(customerId, mockOrderItems);

    expect(order.customerId).toBe(customerId);
    expect(order.getOrderItems()).toHaveLength(2);
    expect(order.getStatus()).toBe(OrderStatus.AWAITING_PAYMENT);
    expect(order.getTotal()).toBe(40); // (2 * 10) + (1 * 20)
  });

  it("should not create order without items", () => {
    expect(() => Order.create("customer-1", [])).toThrow(DomainError);
  });

  it("should transition through order statuses correctly", () => {
    const order = Order.create("customer-1", mockOrderItems);

    order.pay();
    expect(order.getStatus()).toBe(OrderStatus.PAID);

    order.receive();
    expect(order.getStatus()).toBe(OrderStatus.RECEIVED);

    order.prepare();
    expect(order.getStatus()).toBe(OrderStatus.IN_PREPARATION);

    order.ready();
    expect(order.getStatus()).toBe(OrderStatus.READY);

    order.complete();
    expect(order.getStatus()).toBe(OrderStatus.COMPLETED);
  });

  it("should not allow invalid status transitions", () => {
    const order = Order.create("customer-1", mockOrderItems);
    expect(() => order.complete()).toThrow(DomainError);
  });
});
