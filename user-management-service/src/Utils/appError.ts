class AppError extends Error {
  statusCode: Number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: Number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
