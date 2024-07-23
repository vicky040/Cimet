import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'A simple Express User API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['givenName', 'familyName'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the user',
            },
            givenName: {
              type: 'string',
              description: 'The given name of the user',
            },
            familyName: {
              type: 'string',
              description: 'The family name of the user',
            },
          },
        },
      },
      securitySchemes: {
        apikeyAuth: {
          type: 'apiKey',
          in: 'header', 
          name: 'api-key',
        },
      },
    },
  },
  apis: ['./src/rest/*.ts'], 
  security: [{ apikeyAuth: [] }],
};




const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app: express.Express) => {
  app.use('/rest-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;