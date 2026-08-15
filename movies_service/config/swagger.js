import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Microservice API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Movie Microservice, which handles movie data management, including CRUD operations and search functionality.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs (scans route files for JSDoc comments)
  apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec