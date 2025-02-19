import type { OpenAPIV3 } from 'openapi-types'

const swaggerConfig: Omit<OpenAPIV3.Document, 'paths'> = {
  openapi: '3.0.0',
  info: {
    title: 'Lanchonete G41 - Orders Service',
    description: 'Lanchonete G41 API to manage orders',
    version: '0.1.0',
    contact: {
      name: 'Lanchonete G41',
      email: 'lanchoneteg41@gmail.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  tags: [{ name: 'Orders', description: 'Orders related end-points' }]
}

export default swaggerConfig
