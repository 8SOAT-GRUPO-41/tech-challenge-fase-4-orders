import { UpdateOrderStatus } from "@/application/usecases";
import { makeOrderRepository } from "@/infrastructure/factories/repositories";

export const makeUpdateOrderStatus = () => {
  return new UpdateOrderStatus(makeOrderRepository());
};
