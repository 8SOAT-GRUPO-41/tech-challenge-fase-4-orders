import type { Product } from '@/domain/entities'

export interface ProductGateway {
  findById(id: string): Promise<Product | null>
}
