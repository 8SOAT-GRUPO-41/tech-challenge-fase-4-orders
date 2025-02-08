import { PostgresDatabaseConnection } from '@/infrastructure/database/postgres-connection'
import { OrderRepositoryDatabase } from '@/infrastructure/repository'
import type { OrderRepository } from '@/application/ports'

export const makeOrderRepository = (): OrderRepository => {
  return new OrderRepositoryDatabase(PostgresDatabaseConnection.getInstance())
}
