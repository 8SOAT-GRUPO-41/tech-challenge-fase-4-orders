import type { ProductGateway } from '@/application/ports'
import { ProductGatewayMS } from '@/infrastructure/gateway'

export const makeProductGateway = (): ProductGateway => {
  return new ProductGatewayMS()
}
