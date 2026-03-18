import type { Server } from "socket.io";
import { chatFriend } from "../controller/chat.controller";
import { downloadObject } from "../util/s3";

const ChatSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("message", (msg) => {
      chatFriend({
        ...msg,
        from:msg.from.id
      })
      io.to(msg.to).emit("message", {
        from: msg.from,
        message: msg.message,
      });
    });
    socket.on("attachment",async(payload)=>{
        chatFriend({
        ...payload,
        from:payload.from.id
      })
      io.to(payload.to).emit("attachment", {
        from: payload.from,
        message: payload.message,
        file:{
          path: await downloadObject(payload.file.path),
          type: payload.file.type
        }
      });
    })
  });
};

export default ChatSocket;
