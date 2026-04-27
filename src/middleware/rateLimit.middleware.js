import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after an hour",
  handler: (req, res, next) => {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(429).json({
      message: "Too many requests from this IP, please try again after an hour",
    });
  },
});

export default limiter;
