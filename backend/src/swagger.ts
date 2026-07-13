import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hospital Management System API",
      version: "1.0.0",
      description: "Department management endpoints for the Enterprise Hospital Management System",
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/swagger/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
