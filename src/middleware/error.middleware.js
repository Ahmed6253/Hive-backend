const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error(`Status: ${statusCode}`);
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error("---");

  res.status(statusCode).json({
    statusCode,
    success: false,
    message: statusCode === 500 ? "Internal Server Error " : err.message,
  });
};

export default errorMiddleware;
