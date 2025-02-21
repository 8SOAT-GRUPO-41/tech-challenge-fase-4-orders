import type { CreateOrder, LoadOrderById, LoadOrders, UpdateOrderStatus } from '@/application/usecases/order'
import type { HttpRequest, HttpResponse } from '@/infrastructure/http/interfaces'
import { HttpStatusCode } from '@/infrastructure/http/helper'
import type { Controller } from '@/infrastructure/controllers/interfaces'
import type { OrderStatus } from '@/domain/enums'

interface CreateOrderInput {
  customerId: string
  products: { productId: string; quantity: number }[]
}

export class CreateOrderController implements Controller {
  constructor(private readonly createOrderUseCase: CreateOrder) {}

  async handle(request: HttpRequest<CreateOrderInput>): Promise<HttpResponse> {
    const input = request.body
    const result = await this.createOrderUseCase.execute(input)
    return {
      statusCode: HttpStatusCode.CREATED,
      body: result.toJSON()
    }
  }
}

export class LoadOrdersController implements Controller {
  constructor(private readonly loadOrdersUseCase: LoadOrders) {}

  async handle(_request: HttpRequest): Promise<HttpResponse> {
    const result = await this.loadOrdersUseCase.execute()
    return {
      statusCode: HttpStatusCode.OK,
      body: result.map((order) => order.toJSON())
    }
  }
}

export class LoadOrderByIdController implements Controller {
  constructor(private readonly loadOrderByIdUseCase: LoadOrderById) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const params = request.params as { orderId: string }
    const result = await this.loadOrderByIdUseCase.execute(params.orderId)
    return {
      statusCode: HttpStatusCode.OK,
      body: result.toJSON()
    }
  }
}

export class UpdateOrderStatusController implements Controller {
  constructor(private readonly updateOrderStatusUseCase: UpdateOrderStatus) {}

  async handle(
    request: HttpRequest<
      { status: OrderStatus },
      null,
      {
        orderId: string
      }
    >
  ): Promise<HttpResponse> {
    const status = request.body.status
    const orderId = request.params.orderId
    await this.updateOrderStatusUseCase.execute({
      orderId,
      status
    })
    return {
      statusCode: HttpStatusCode.OK,
      body: {
        message: 'Order status updated successfully'
      }
    }
  }
}
