import { makeOrderRepository } from '@/infrastructure/factories/repositories'
import { CreateOrder } from '@/application/usecases/order'
import { makeCustomerGateway, makeProductGateway } from '@/infrastructure/factories/gateways'

export const makeCreateOrder = (): CreateOrder => {
  return new CreateOrder(makeOrderRepository(), makeProductGateway(), makeCustomerGateway())
}
