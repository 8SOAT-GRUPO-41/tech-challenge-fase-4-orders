import { Payment } from "@/domain/entities";
import type { PaymentRepository } from "@/application/ports";
import type { DatabaseConnection } from "@/infrastructure/database/database-connection";

export class PaymentRepositoryDatabase implements PaymentRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  async findById(id: string): Promise<Payment | null> {
    const sql = "SELECT * FROM payments WHERE payment_id = $1";
    const result = await this.databaseConnection.query<{
      payment_id: string;
      order_id: string;
      status: string;
    }>(sql, [id]);
    const payment = result[0];
    if (!payment) return null;
    return new Payment(payment.payment_id, payment.order_id, payment.status);
  }

  async update(payment: Payment): Promise<void> {
    const sql = "UPDATE payments SET status = $1 WHERE payment_id = $2";
    await this.databaseConnection.query(sql, [
      payment.status,
      payment.paymentId,
    ]);
  }
}
