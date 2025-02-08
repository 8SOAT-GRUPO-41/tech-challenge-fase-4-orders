import {
  makeProductRepository,
  makeCustomerRepository,
  makeOrderRepository
} from '@/infrastructure/factories/repositories'
import { CreateOrder } from '@/application/usecases/order'

export const makeCreateOrder = (): CreateOrder => {
  return new CreateOrder(makeOrderRepository(), makeProductRepository(), makeCustomerRepository())
}
