import { OrdersGatewayMS } from "@/infrastructure/gateway";

export const makeOrdersGateway = (): OrdersGatewayMS => {
  return new OrdersGatewayMS();
};
