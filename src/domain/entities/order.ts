import { randomUUID } from 'node:crypto'
import { OrderStatus, PaymentStatus } from '@/domain/enums'
import { DomainError } from '@/domain/errors'
import { Price } from '@/domain/value-objects'
import type { Customer, OrderItem } from '@/domain/entities'

export class Order {
  private constructor(
    readonly orderId: string,
    private customer: Customer,
    private orderItems: OrderItem[],
    private status: OrderStatus,
    private total: Price,
    private paymentStatus: PaymentStatus = PaymentStatus.PENDING,
    private orderDate: Date = new Date()
  ) {
    if (orderItems.length === 0) {
      throw new DomainError('Order must have at least one item')
    }
  }

  static create(customer: Customer, orderItems: OrderItem[]): Order {
    const orderId = randomUUID()
    const total = Order.calculateTotal(orderItems)
    return new Order(orderId, customer, orderItems, OrderStatus.AWAITING_PAYMENT, new Price(total))
  }

  static restore(
    orderId: string,
    customer: Customer,
    orderItems: OrderItem[],
    status: OrderStatus,
    paymentStatus: PaymentStatus,
    orderDate: Date
  ): Order {
    const total = Order.calculateTotal(orderItems)
    return new Order(orderId, customer, orderItems, status, new Price(total), paymentStatus, orderDate)
  }

  private static calculateTotal(orderItems: OrderItem[]): number {
    return orderItems.reduce((acc, item) => acc + item.getPrice(), 0)
  }

  getCustomer = () => this.customer

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

  getPaymentStatus = () => this.paymentStatus

  getOrderDate = () => this.orderDate

  setPaymentStatus = (paymentStatus: PaymentStatus) => {
    this.paymentStatus = paymentStatus
  }

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

  private transitionTo(status: OrderStatus) {
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
      customer: this.customer.toJSON(),
      orderItems: this.orderItems.map((item) => item.toJSON()),
      paymentStatus: this.paymentStatus,
      orderDate: this.orderDate.toISOString()
    }
  }
}
