import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to mongoDb");
  })
  .catch((error) => {
    console.log(error);
  });
const __dirname = path.resolve();
app.listen(8000, () => {
  console.log("server listning port 8000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    succuss: false,
    statusCode,
    message,
  });
});
