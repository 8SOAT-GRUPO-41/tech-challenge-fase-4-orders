import type { ProductRepository } from '@/application/ports'
import { NotFoundError } from '@/domain/errors'

export class DeleteProduct {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id)
    if (!product) throw new NotFoundError('Product not found')
    await this.productRepository.delete(id)
  }
}
