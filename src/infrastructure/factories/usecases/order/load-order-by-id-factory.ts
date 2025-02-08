import { makeOrderRepository } from '@/infrastructure/factories/repositories'
import { LoadOrderById } from '@/application/usecases/order'

export const makeLoadOrderById = (): LoadOrderById => {
  return new LoadOrderById(makeOrderRepository())
}
