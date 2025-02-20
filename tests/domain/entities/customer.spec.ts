import { Customer } from "@/domain/entities";
import { InvalidParamError } from "@/domain/errors";

describe("Customer Entity", () => {
  const validCpf = "12345678909";
  const validEmail = "test@example.com";
  const validName = "John Doe";

  it("should create a new customer", () => {
    const customer = Customer.create(validCpf, validName, validEmail);
    expect(customer.customerId).toBeDefined();
    expect(customer.getCpf()).toBe(validCpf);
    expect(customer.getName()).toBe(validName);
    expect(customer.getEmail()).toBe(validEmail);
  });

  it("should create a customer without optional fields", () => {
    const customer = Customer.create(validCpf);
    expect(customer.getName()).toBeUndefined();
    expect(customer.getEmail()).toBeUndefined();
  });

  it("should restore a customer", () => {
    const customerId = "test-id";
    const customer = Customer.restore(
      customerId,
      validCpf,
      validName,
      validEmail
    );
    expect(customer.customerId).toBe(customerId);
    expect(customer.getCpf()).toBe(validCpf);
    expect(customer.getName()).toBe(validName);
    expect(customer.getEmail()).toBe(validEmail);
  });

  it("should update customer name", () => {
    const customer = Customer.create(validCpf);
    const newName = "Jane Doe";
    customer.setName(newName);
    expect(customer.getName()).toBe(newName);
  });

  it("should convert to JSON correctly", () => {
    const customer = Customer.create(validCpf, validName, validEmail);
    const json = customer.toJSON();
    expect(json).toEqual({
      customerId: customer.customerId,
      name: validName,
      email: validEmail,
      cpf: validCpf,
    });
  });

  it("should convert to JSON with empty optional fields", () => {
    const customer = Customer.create(validCpf);
    const json = customer.toJSON();
    expect(json).toEqual({
      customerId: customer.customerId,
      name: "",
      email: "",
      cpf: validCpf,
    });
  });
});
