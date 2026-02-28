import dotenv from "dotenv";
dotenv.config();

const env = {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontBaseUrl: process.env.FRONT_BASE_URL,
  nodeEnv: process.env.NODE_ENV,
  oauthClientId: process.env.OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
};

export default env;
