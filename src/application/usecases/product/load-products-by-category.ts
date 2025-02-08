import type { ProductRepository } from '@/application/ports'
import type { Product } from '@/domain/entities'
import type { ProductCategory } from '@/domain/enums'

export class LoadProductsByCategory {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(category: ProductCategory): Promise<Product[]> {
    return this.productRepository.findByCategory(category)
  }
}
