import { makeOrderRepository } from '@/infrastructure/factories/repositories'
import { UpdateOrderStatus } from '@/application/usecases/order'

export const makeUpdateOrderStatus = (): UpdateOrderStatus => {
  return new UpdateOrderStatus(makeOrderRepository())
}
