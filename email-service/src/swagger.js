// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    servers: [{ url: "http://email-srv:3000" }],
    info: {
      title: "Swagger Express API",
      version: "1.0.0",
      description: "A simple Express API with Swagger documentation",
    },
  },
  apis: ["./src/routes/*.js"], // Path to your API routes
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
