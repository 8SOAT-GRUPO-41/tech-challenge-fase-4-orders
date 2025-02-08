export const productSchema = {
  type: 'object',
  properties: {
    productId: { type: 'string', format: 'uuid' },
    name: { type: 'string', examples: ['Coca Zero'] },
    price: { type: 'number', examples: [9] },
    description: { type: 'string', examples: ['Bem geladinha'] },
    category: { type: 'string', examples: ['Bebida'] }
  }
}

export const productSchemaWithoutId = {
  type: 'object',
  properties: {
    name: { type: 'string', examples: ['Coca Zero'], minLength: 3 },
    price: { type: 'number', examples: [9] },
    description: { type: 'string', examples: ['Bem geladinha'] },
    category: { type: 'string', examples: ['Bebida'], enum: ['Lanche', 'Acompanhamento', 'Bebida', 'Sobremesa'] }
  }
}
