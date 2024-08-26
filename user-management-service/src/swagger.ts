// swagger.js
// @ts-ignore
import swaggerJsdoc from "swagger-jsdoc";
// @ts-ignore
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    //servers: [{ url: "http://user-management-srv:3000" }],
    info: {
      title: "Swagger Express API",
      version: "1.0.0",
      description: "A simple Express API with Swagger documentation",
    },
    components: {
      schemas: {
        Customer: {
          type: "object",
          properties: {
            nic: {
              type: "string",
              description: "National Identity Card number",
            },
            name: {
              type: "string",
              description: "Customer's full name",
            },
            address: {
              type: "string",
              description: "Customer's address",
            },
            mobile: {
              type: "string",
              description: "Unique mobile phone number",
              uniqueItems: true,
            },
            registered_date: {
              type: "string",
              format: "date-time",
              description: "Date when the customer was registered",
            },
            loyalty_points: {
              type: "integer",
              description: "Customer's loyalty points",
            },
          },
          required: [
            "nic",
            "name",
            "address",
            "mobile",
            "registered_date",
            "loyalty_points",
          ],
        },
        Employee: {
          type: "object",
          properties: {
            employee_id: {
              type: "integer",
              description: "Employee ID",
            },
            employee_name: {
              type: "string",
              description: "Employee's name",
            },
            email: {
              type: "string",
              description: "Unique email address",
              uniqueItems: true,
            },
            password: {
              type: "string",
              description: "Password (default: '12345678')",
            },
            role: {
              $ref: "#/components/schemas/Role",
              description: "Role associated with the employee",
            },
            is_active: {
              type: "boolean",
              nullable: true,
              description: "Whether the employee is active",
            },
            temporary: {
              type: "boolean",
              nullable: true,
              description: "Whether the employee is temporary",
            },
            password_changed_at: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Timestamp of last password change",
            },
            password_reset_token: {
              type: "string",
              nullable: true,
              description: "Password reset token",
            },
            password_reset_expires: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Password reset token expiry time",
            },
          },
          required: ["employee_name", "email", "password"],
        },
        Role: {
          type: "object",
          properties: {
            role_id: {
              type: "integer",
              description: "Role ID",
            },
            role_name: {
              type: "string",
              description: "Name of the role",
            },
            employees: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Employee",
              },
              description: "List of employees associated with this role",
            },
          },
          required: ["role_name"],
        },
      },
    },
  },
  apis: ["./src/Routes/*.ts"], // Path to your API routes
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
