class ApiResponse {
  constructor(statusCode, data, message = "Success", dataKey = "data") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.dataKey = dataKey;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      [this.dataKey]: this.data,
    });
  }
}

export default ApiResponse;
