import type { Customer } from '@/domain/entities'

export interface CustomerGateway {
  findById(id: string): Promise<Customer | null>
}
