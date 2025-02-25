import {
  makeLoadOrdersController,
  makeCreateOrderController,
  makeLoadOrderByIdController,
  makeUpdateOrderStatusController
} from '@/infrastructure/factories/controllers'
import { errorResponseSchema } from '@/infrastructure/swagger/error-response-schema'
import { ErrorCodes } from '@/domain/enums'
import { orderSchema } from '@/infrastructure/swagger/schemas/order'
import { customerSchema } from '@/infrastructure/swagger/schemas/customer'
import type { HttpRoute } from '@/infrastructure/http/interfaces'
import { orderItemSchema } from '@/infrastructure/swagger/schemas/order-item'

export const orderRoutes = [
  {
    method: 'get',
    url: '/',
    handler: makeLoadOrdersController,
    schema: {
      tags: ['Orders'],
      summary: 'List all orders',
      response: {
        200: {
          type: 'array',
          items: orderSchema
        },
        500: errorResponseSchema(500, ErrorCodes.INTERNAL_SERVER_ERROR)
      }
    }
  },
  {
    method: 'post',
    url: '/',
    handler: makeCreateOrderController,
    schema: {
      tags: ['Orders'],
      summary: 'Create a new order',
      body: {
        type: 'object',
        properties: {
          customerId: customerSchema.properties.customerId,
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: orderItemSchema.properties.productId,
                quantity: orderItemSchema.properties.quantity
              }
            }
          }
        },
        required: ['customerId', 'products']
      },
      response: {
        201: orderSchema,
        404: errorResponseSchema(404, ErrorCodes.NOT_FOUND),
        422: errorResponseSchema(422, ErrorCodes.UNPROCESSABLE_ENTITY),
        500: errorResponseSchema(500, ErrorCodes.INTERNAL_SERVER_ERROR)
      }
    }
  },
  {
    method: 'get',
    handler: makeLoadOrderByIdController,
    url: '/:orderId',
    schema: {
      tags: ['Orders'],
      summary: 'Get an order by id',
      response: {
        200: orderSchema,
        404: errorResponseSchema(404, ErrorCodes.NOT_FOUND),
        500: errorResponseSchema(500, ErrorCodes.INTERNAL_SERVER_ERROR)
      }
    }
  },
  {
    method: 'put',
    handler: makeUpdateOrderStatusController,
    url: '/:orderId/status',
    schema: {
      tags: ['Orders'],
      summary: 'Update order status',
      body: {
        type: 'object',
        properties: {
          status: orderSchema.properties.status
        },
        required: ['status']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        },
        404: errorResponseSchema(404, ErrorCodes.NOT_FOUND),
        422: errorResponseSchema(422, ErrorCodes.UNPROCESSABLE_ENTITY),
        500: errorResponseSchema(500, ErrorCodes.INTERNAL_SERVER_ERROR)
      }
    }
  }
] as HttpRoute[]
