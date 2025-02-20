import { Cpf } from "@/domain/value-objects";
import { InvalidParamError } from "@/domain/errors";

describe("CPF Value Object", () => {
  it("should create a valid CPF", () => {
    const cpf = new Cpf("12345678909");
    expect(cpf.getValue()).toBe("12345678909");
  });

  it("should accept CPF with special characters", () => {
    const cpf = new Cpf("123.456.789-09");
    expect(cpf.getValue()).toBe("123.456.789-09");
  });

  it("should throw error for invalid CPF", () => {
    expect(() => new Cpf("11111111111")).toThrow(InvalidParamError);
    expect(() => new Cpf("invalid")).toThrow(InvalidParamError);
    expect(() => new Cpf("")).toThrow(InvalidParamError);
  });
});
