import type { ProductRepository } from '@/application/ports'
import type { Product } from '@/domain/entities'
import type { ProductCategory } from '@/domain/enums'
import { NotFoundError } from '@/domain/errors'

type Input = { productId: string } & Partial<{
  name: string
  category: ProductCategory
  price: number
  description: string
}>

export class UpdateProduct {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: Input): Promise<Product> {
    const { productId, name, category, price, description } = input
    const product = await this.productRepository.findById(productId)
    if (!product) throw new NotFoundError('Product not found')
    if (name !== undefined) product.setName(name)
    if (category !== undefined) product.setCategory(category)
    if (price !== undefined) product.setPrice(price)
    if (description !== undefined) product.setDescription(description)
    await this.productRepository.update(product)
    return product
  }
}
