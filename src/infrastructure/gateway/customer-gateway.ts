import type { CustomerGateway } from '@/application/ports'
import { Customer } from '@/domain/entities'
import axios, { type AxiosInstance } from 'axios'

interface CustomerQueryResult {
  customer_id: string
  name: string
  cpf: string
  email: string
}

export class CustomerGatewayMS implements CustomerGateway {
  private readonly customerServiceInstance: AxiosInstance

  constructor() {
    this.customerServiceInstance = axios.create({
      baseURL: process.env.CUSTOMER_SERVICE_URL
    })
  }

  async findById(id: string): Promise<Customer | null> {
    const response = await this.customerServiceInstance.get<CustomerQueryResult>(`/customers/${id}`)
    return Customer.restore(response.data.customer_id, response.data.cpf, response.data.name, response.data.email)
  }
}
