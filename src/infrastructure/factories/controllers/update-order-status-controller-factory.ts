import { UpdateOrderStatusController } from "@/infrastructure/controllers";
import { makeUpdateOrderStatus } from "@/infrastructure/factories/usecases/order";

export const makeUpdateOrderStatusController = () => {
  return new UpdateOrderStatusController(makeUpdateOrderStatus());
};
