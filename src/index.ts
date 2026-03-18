import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/user.router";
import StorageRouter from "./routes/storage.router";
import AuthMiddleware from "./middlewares/auth.middleware";
import FriendRouter from "./routes/friend.router";
import { serve, setup } from "swagger-ui-express";
import SwaggerConfig from "./util/swagger";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { corsConfig } from "./util/config";
import StatusSocket from "./socket/status.socket";
import ChatSocket from "./socket/chat.socket";
import ChatRouter from "./routes/chat.router";
import VideoSocket from "./socket/video.socket";
import twilioRouter from "./routes/twilo.router";
import PostRouter from "./routes/post.router";

// dotenv.config();

// MONGO CONNECT
mongoose
  .connect(process.env.DB_URL as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Failed to connect Database", err));

const app = express();
const server = createServer(app)

// SERVER START
server.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// socket connection
const io = new Server(server, {cors:corsConfig})
StatusSocket(io)
ChatSocket(io)
VideoSocket(io)

// ✅ CORS MUST COME FIRST
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// BODY PARSERS
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api-docs", serve, setup(SwaggerConfig));
app.use("/api/v1/auth", UserRouter);
app.use("/api/v1/storage", StorageRouter);
app.use("/api/v1/friend", AuthMiddleware, FriendRouter);
app.use("/api/v1/chat", AuthMiddleware, ChatRouter)
app.use("/api/v1/twilio", AuthMiddleware, twilioRouter)
app.use("/api/v1/post", AuthMiddleware, PostRouter)
