import { Router } from "express";
import { fetchChats } from "../controller/chat.controller";

const ChatRouter = Router();

ChatRouter.get("/:to", fetchChats);
export default ChatRouter;
