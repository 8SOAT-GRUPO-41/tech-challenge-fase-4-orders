import { UpdateOrderStatus } from '@/application/usecases/order'
import type { Order } from '@/domain/entities'
import { OrderStatus } from '@/domain/enums'

describe('UpdateOrderStatus UseCase', () => {
  const mockOrder = {
    id: 'order-1',
    status: OrderStatus.AWAITING_PAYMENT,
    transitionTo: jest.fn()
  } as unknown as Order

  const mockOrderRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn()
  }

  const updateOrderStatus = new UpdateOrderStatus(mockOrderRepository)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update order status successfully', async () => {
    mockOrderRepository.findById.mockResolvedValue(mockOrder)

    const input = {
      orderId: 'order-1',
      status: OrderStatus.PAID
    }

    await updateOrderStatus.execute(input)

    expect(mockOrderRepository.findById).toHaveBeenCalledWith('order-1')
    expect(mockOrder.transitionTo).toHaveBeenCalledWith(OrderStatus.PAID)
    expect(mockOrderRepository.update).toHaveBeenCalledWith(mockOrder)
  })

  it('should throw error when order is not found', async () => {
    mockOrderRepository.findById.mockResolvedValueOnce(null)

    const input = {
      orderId: 'invalid-order',
      status: OrderStatus.IN_PREPARATION
    }

    await expect(updateOrderStatus.execute(input)).rejects.toThrow('Order not found')
  })
})
