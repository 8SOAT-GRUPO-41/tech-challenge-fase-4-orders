import type { Product } from '@/domain/entities'

export interface ProductRepository {
  save(product: Product): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Product | null>
  update(product: Product): Promise<void>
  findByCategory(category: string): Promise<Product[]>
}
