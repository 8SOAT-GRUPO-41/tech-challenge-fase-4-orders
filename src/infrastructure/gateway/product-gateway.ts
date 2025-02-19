import type { ProductGateway } from '@/application/ports/product-gateway'
import { Product } from '@/domain/entities'
import type { ProductCategory } from '@/domain/enums'
import axios, { type AxiosInstance } from 'axios'

interface ProductQueryResult {
  product_id: string
  name: string
  category: ProductCategory
  price: string
  description: string
}

export class ProductGatewayMS implements ProductGateway {
  private readonly productServiceInstance: AxiosInstance

  constructor() {
    this.productServiceInstance = axios.create({
      baseURL: process.env.PRODUCT_SERVICE_URL
    })
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await this.productServiceInstance.get<ProductQueryResult>(`/products/${id}`)
      return Product.restore(
        response.data.product_id,
        response.data.name,
        response.data.category,
        +response.data.price,
        response.data.description
      )
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null
      }
      throw error
    }
  }
}
