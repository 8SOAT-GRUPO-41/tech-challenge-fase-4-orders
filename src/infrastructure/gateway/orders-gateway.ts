import type { OrdersGateway } from "@/application/ports";
import { Order, OrderItem } from "@/domain/entities";
import { OrderStatus } from "@/domain/enums";
import axios, { type AxiosInstance } from "axios";
import { ExternalApiError } from "@/domain/errors";

interface OrderQueryResult {
  order_id: string;
  customer_id: string;
  status: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  created_at: Date;
}

export class OrdersGatewayMS implements OrdersGateway {
  private readonly ordersServiceInstance: AxiosInstance;

  constructor() {
    this.ordersServiceInstance = axios.create({
      baseURL: process.env.ORDERS_SERVICE_URL,
    });
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const response = await this.ordersServiceInstance.get<OrderQueryResult>(
        `/orders/id/${id}`
      );
      return Order.restore(
        response.data.order_id,
        response.data.customer_id,
        response.data.items.map((item) =>
          OrderItem.restore(item.product_id, item.quantity, item.price)
        ),
        response.data.status as OrderStatus,
        response.data.created_at
      );
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      await this.ordersServiceInstance.patch(`/orders/${orderId}/status`, {
        status,
      });
    } catch (error: any) {
      throw new ExternalApiError(
        error.response?.data?.message || "Failed to update order status",
        `/orders/${orderId}/status`,
        "PATCH",
        error.response?.status || 500
      );
    }
  }
}
