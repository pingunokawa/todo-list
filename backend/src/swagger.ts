// src/swagger.ts
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TodoList API Documentation',
      version: '1.0.0',
      description: 'A Simple Rest API of TodoList',
    },
  },
  apis: ['./dist/server.js'],
};

const specs = swaggerJsdoc(options);

export default swaggerUiExpress.setup(specs);
