import { ValidationError } from "express-validator";

interface SerializedError {
  message: string;
  field?: string;
}

export class RequestValidationError extends Error {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): SerializedError[] {
    return this.errors.map((err) => {
      // Ensure the error has the expected properties
      if ("msg" in err && "param" in err) {
        return { message: err.msg, field: err.param };
      } else {
        return { message: err.msg || "Invalid input", field: "unknown" };
      }
    });
  }
}
