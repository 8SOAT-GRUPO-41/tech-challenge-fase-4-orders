import type { Controller } from "@/infrastructure/controllers/interfaces";
import type { UpdateOrderStatus } from "@/application/usecases";
import type {
  HttpRequest,
  HttpResponse,
} from "@/infrastructure/http/interfaces";
import { HttpStatusCode } from "@/infrastructure/http/helper";
export class UpdateOrderStatusController implements Controller {
  constructor(private readonly updateOrderStatus: UpdateOrderStatus) {}
  async handle(
    request: HttpRequest<{ status: string }, null, { id: string }>
  ): Promise<HttpResponse> {
    await this.updateOrderStatus.execute(
      request.params.id,
      request.body.status
    );
    return {
      statusCode: HttpStatusCode.OK,
      body: { message: "Order status updated successfully" },
    };
  }
}
