import { Email } from "@/domain/value-objects";
import { InvalidParamError } from "@/domain/errors";

describe("Email Value Object", () => {
  it("should create a valid email", () => {
    const email = new Email("test@example.com");
    expect(email.getValue()).toBe("test@example.com");
  });

  it("should throw error for invalid email", () => {
    expect(() => new Email("invalid")).toThrow(InvalidParamError);
    expect(() => new Email("")).toThrow(InvalidParamError);
    expect(() => new Email("test@")).toThrow(InvalidParamError);
  });
});
