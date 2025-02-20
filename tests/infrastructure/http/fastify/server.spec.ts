import { FastifyHttpServer } from "@/infrastructure/http/fastify/server";
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

// Mockando os módulos
jest.mock("fastify");
jest.mock("@fastify/swagger");
jest.mock("@fastify/swagger-ui");

// Criando um mock mais específico do servidor Fastify com suporte a chaining
const mockServer = {
  register: jest.fn().mockReturnThis(), // Retorna this para permitir chaining
  ready: jest.fn().mockResolvedValue(undefined),
  listen: jest.fn().mockResolvedValue(undefined),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Corrigindo a tipagem do mock do fastify
const mockedFastify = fastify as jest.MockedFunction<typeof fastify>;
mockedFastify.mockReturnValue(mockServer);

describe("FastifyHttpServer", () => {
  let server: FastifyHttpServer;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
    server = new FastifyHttpServer();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should create server with development logger when NODE_ENV is development", () => {
    process.env.NODE_ENV = "development";
    new FastifyHttpServer();
    expect(mockedFastify).toHaveBeenCalledWith(
      expect.objectContaining({
        logger: expect.objectContaining({
          transport: expect.objectContaining({
            target: "pino-pretty",
          }),
        }),
      })
    );
  });

  it("should create server with production logger when NODE_ENV is production", () => {
    process.env.NODE_ENV = "production";
    new FastifyHttpServer();
    expect(mockedFastify).toHaveBeenCalledWith(
      expect.objectContaining({
        logger: true,
      })
    );
  });

  it("should register swagger documentation", async () => {
    await server.listen(3000);
    expect(mockServer.register).toHaveBeenCalledWith(fastifySwagger, {
      openapi: expect.any(Object),
    });
    expect(mockServer.register).toHaveBeenCalledWith(fastifySwaggerUI, {
      routePrefix: "/orders-docs",
    });
  });

  it("should listen on specified port and host", async () => {
    await server.listen(3000);
    expect(mockServer.listen).toHaveBeenCalledWith({
      port: 3000,
      host: "0.0.0.0",
    });
  });
});
