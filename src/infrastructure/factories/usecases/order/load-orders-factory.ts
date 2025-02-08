import { makeOrderRepository } from '@/infrastructure/factories/repositories'
import { LoadOrders } from '@/application/usecases/order/load-orders'

export const makeLoadOrders = (): LoadOrders => {
  return new LoadOrders(makeOrderRepository())
}
