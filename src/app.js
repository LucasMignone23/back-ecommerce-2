import express from "express";
import config from "./config/config.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import sessionRouter from "./routes/session.router.js";
import userRouter from "./routes/user.router.js";
import cors from "cors";

const PORT = config.port;
const MONGO_URL = config.mongoUrl;

const app = express();

const allowedOrigins = [
  `http://localhost:${PORT}`,
  config.frontendUrl,
  config.frontendDevUrl,
];

console.log("Allowed Origins:", allowedOrigins); // Para depuración

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS bloqueado para origen: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use("/api/session", sessionRouter);
app.use("/api/user", userRouter);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
      console.log("Connected to MongoDB");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });