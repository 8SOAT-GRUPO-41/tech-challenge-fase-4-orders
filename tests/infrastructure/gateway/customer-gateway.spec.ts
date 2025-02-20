import { CustomerGatewayMS } from "@/infrastructure/gateway/customer-gateway";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CustomerGateway", () => {
  const mockCustomerData = {
    customer_id: "customer-1",
    name: "John Doe",
    cpf: "12345678909",
    email: "john@example.com",
  };

  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockCustomerData }),
    } as any);
  });

  it("should find customer by id", async () => {
    const gateway = new CustomerGatewayMS();
    const customer = await gateway.findById("customer-1");
    expect(customer).toBeDefined();
    expect(customer?.customerId).toBe(mockCustomerData.customer_id);
  });

  it("should return null when customer is not found", async () => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue({ response: { status: 404 } }),
    } as any);

    const gateway = new CustomerGatewayMS();
    const customer = await gateway.findById("non-existent");
    expect(customer).toBeNull();
  });

  it("should propagate other errors", async () => {
    const error = new Error("Network error");
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue(error),
    } as any);

    const gateway = new CustomerGatewayMS();
    await expect(gateway.findById("customer-1")).rejects.toThrow(error);
  });
});
