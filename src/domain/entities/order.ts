import { randomUUID } from 'node:crypto'
import { OrderStatus } from '@/domain/enums'
import { DomainError } from '@/domain/errors'
import { Price } from '@/domain/value-objects'
import type { OrderItem } from '@/domain/entities/order-item'

export class Order {
  private constructor(
    readonly orderId: string,
    readonly customerId: string,
    private orderItems: OrderItem[],
    private status: OrderStatus,
    private total: Price,
    private orderDate: Date = new Date()
  ) {
    if (orderItems.length === 0) {
      throw new DomainError('Order must have at least one item')
    }
  }

  static create(customerId: string, orderItems: OrderItem[]): Order {
    const orderId = randomUUID()
    const total = Order.calculateTotal(orderItems)
    return new Order(orderId, customerId, orderItems, OrderStatus.AWAITING_PAYMENT, new Price(total))
  }

  static restore(
    orderId: string,
    customerId: string,
    orderItems: OrderItem[],
    status: OrderStatus,
    orderDate: Date
  ): Order {
    const total = Order.calculateTotal(orderItems)
    return new Order(orderId, customerId, orderItems, status, new Price(total), orderDate)
  }

  private static calculateTotal(orderItems: OrderItem[]): number {
    return orderItems.reduce((acc, item) => acc + item.getPrice(), 0)
  }

  getCustomerId = () => this.customerId

  getOrderItems = () => this.orderItems

  setOrderItems = (orderItems: OrderItem[]) => {
    if (orderItems.length === 0) {
      throw new DomainError('Order must have at least one item')
    }
    this.orderItems = orderItems
    this.total = new Price(Order.calculateTotal(orderItems))
  }

  getStatus = () => this.status

  getTotal = () => this.total.getValue()

  getOrderDate = () => this.orderDate

  private canTransitionTo(status: OrderStatus): boolean {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.AWAITING_PAYMENT]: [OrderStatus.PAID],
      [OrderStatus.PAID]: [OrderStatus.RECEIVED],
      [OrderStatus.RECEIVED]: [OrderStatus.IN_PREPARATION],
      [OrderStatus.IN_PREPARATION]: [OrderStatus.READY],
      [OrderStatus.READY]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: []
    }
    return transitions[this.status].includes(status)
  }

  transitionTo(status: OrderStatus) {
    if (this.status === status) {
      throw new DomainError(`The order is already in the ${status} status`)
    }
    if (!this.canTransitionTo(status)) {
      throw new DomainError(`Can't transition from ${this.status} to ${status}`)
    }
    this.status = status
  }

  pay() {
    this.transitionTo(OrderStatus.PAID)
  }

  receive() {
    this.transitionTo(OrderStatus.RECEIVED)
  }

  prepare() {
    this.transitionTo(OrderStatus.IN_PREPARATION)
  }

  ready() {
    this.transitionTo(OrderStatus.READY)
  }

  complete() {
    this.transitionTo(OrderStatus.COMPLETED)
  }

  toJSON() {
    return {
      orderId: this.orderId,
      status: this.status,
      total: this.total.getValue(),
      customerId: this.customerId,
      orderItems: this.orderItems.map((item) => item.toJSON()),
      orderDate: this.orderDate.toISOString()
    }
  }
}
