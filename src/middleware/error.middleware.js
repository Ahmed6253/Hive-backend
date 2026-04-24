import ApiResponse from "../utils/ApiResponse.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error(`Status: ${statusCode}`);
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error("---");

  new ApiResponse(
    statusCode,
    null,
    statusCode === 500 ? "Internal Server Error" : err.message,
  ).send(res);
};

export default errorMiddleware;
