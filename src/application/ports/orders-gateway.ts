export interface OrdersGateway {
  updateOrderStatus(orderId: string, status: string): Promise<void>;
}
