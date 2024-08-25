// swagger.js
// @ts-ignore
import swaggerJsdoc from "swagger-jsdoc";
// @ts-ignore
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    servers: [{ url: "http://product-srv:3000" }],
    info: {
      title: "Swagger Express API",
      version: "1.0.0",
      description: "A simple Express API with Swagger documentation",
    },
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            product_id: {
              type: "integer",
              description: "Unique identifier for the product",
            },
            product_name: {
              type: "string",
              description: "Name of the product",
            },
            unit_weight: {
              type: "string",
              description: "Unit weight of the product",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Item",
              },
              description: "List of items associated with the product",
            },
          },
          required: ["product_name", "unit_weight"],
        },
        Item: {
          type: "object",
          properties: {
            item_id: {
              type: "integer",
              description: "Unique identifier for the item",
            },
            product: {
              $ref: "#/components/schemas/Product",
              description: "Associated product",
            },
            batch_code: {
              type: "string",
              description: "Batch code of the item",
            },
            buying_price: {
              type: "number",
              description: "Buying price of the item",
            },
            selling_price: {
              type: "number",
              description: "Selling price of the item",
            },
            mfd: {
              type: "string",
              format: "date",
              description: "Manufacture date of the item",
            },
            exp: {
              type: "string",
              format: "date",
              description: "Expiry date of the item",
            },
          },
          required: [
            "product",
            "batch_code",
            "buying_price",
            "selling_price",
            "mfd",
            "exp",
          ],
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to your API routes
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
