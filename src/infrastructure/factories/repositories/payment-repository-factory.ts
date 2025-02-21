import { PaymentRepositoryDatabase } from "@/infrastructure/repository";
import { PostgresDatabaseConnection } from "@/infrastructure/database/postgres-connection";

export const makePaymentRepository = () => {
  return new PaymentRepositoryDatabase(
    PostgresDatabaseConnection.getInstance()
  );
};
