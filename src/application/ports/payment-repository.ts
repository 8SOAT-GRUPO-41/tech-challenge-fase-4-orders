import type { Payment } from "@/domain/entities";

export interface PaymentRepository {
  findById(id: string): Promise<Payment | null>;
  update(payment: Payment): Promise<void>;
}
