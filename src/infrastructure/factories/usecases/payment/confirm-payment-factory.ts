import { ConfirmPayment } from "@/application/usecases";
import { makePaymentRepository } from "@/infrastructure/factories/repositories";
import { makeOrdersGateway } from "@/infrastructure/factories/gateways/orders-gateway-factory";

export const makeConfirmPayment = (): ConfirmPayment => {
  return new ConfirmPayment(makePaymentRepository(), makeOrdersGateway());
};
