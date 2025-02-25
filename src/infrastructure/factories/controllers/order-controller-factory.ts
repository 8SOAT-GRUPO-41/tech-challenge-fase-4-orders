import {
  CreateOrderController,
  LoadOrdersController,
  LoadOrderByIdController,
  UpdateOrderStatusController
} from '@/infrastructure/controllers/order-controller'
import {
  makeLoadOrders,
  makeCreateOrder,
  makeLoadOrderById,
  makeUpdateOrderStatus
} from '@/infrastructure/factories/usecases/order'
import type { Controller } from '@/infrastructure/controllers/interfaces'

export const makeCreateOrderController = (): Controller => {
  return new CreateOrderController(makeCreateOrder())
}

export const makeLoadOrdersController = (): Controller => {
  return new LoadOrdersController(makeLoadOrders())
}

export const makeLoadOrderByIdController = (): Controller => {
  return new LoadOrderByIdController(makeLoadOrderById())
}

export const makeUpdateOrderStatusController = (): Controller => {
  return new UpdateOrderStatusController(makeUpdateOrderStatus())
}
