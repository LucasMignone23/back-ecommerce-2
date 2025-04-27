import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  cookieSign: process.env.COOKIE_SIGN,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  frontendUrl: process.env.FRONTEND_URL,
  frontendDevUrl: process.env.FRONTEND_DEV_URL,
};