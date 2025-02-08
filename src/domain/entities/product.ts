import { randomUUID } from 'node:crypto'
import { Price } from '@/domain/value-objects'
import type { ProductCategory } from '@/domain/enums'

export class Product {
  private constructor(
    readonly productId: string,
    private name: string,
    private category: ProductCategory,
    private price: Price,
    private description: string
  ) {}

  static create(name: string, category: ProductCategory, price: number, description: string) {
    const productId = randomUUID()
    return new Product(productId, name, category, new Price(price), description)
  }

  static restore(productId: string, name: string, category: ProductCategory, price: number, description: string) {
    return new Product(productId, name, category, new Price(price), description)
  }

  setName = (name: string) => {
    this.name = name
  }

  getName = () => this.name

  getCategory = () => this.category

  getPrice = () => this.price.getValue()

  getDescription = () => this.description

  setPrice = (price: number) => {
    this.price = new Price(price)
  }

  setDescription = (description: string) => {
    this.description = description
  }

  setCategory = (category: ProductCategory) => {
    this.category = category
  }

  toJSON() {
    return {
      productId: this.productId,
      name: this.name,
      price: this.getPrice(),
      description: this.description,
      category: this.category
    }
  }
}
