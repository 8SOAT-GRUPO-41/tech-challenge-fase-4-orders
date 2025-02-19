import type { CustomerGateway } from '@/application/ports'
import { CustomerGatewayMS } from '@/infrastructure/gateway'

export const makeCustomerGateway = (): CustomerGateway => {
  return new CustomerGatewayMS()
}
