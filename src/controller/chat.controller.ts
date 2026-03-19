
import ChatModel from "../models/chat.model";
import type { SessionInterface } from "../middlewares/auth.middleware";
import type { Response } from "express";
import { CatchError } from "../util/error";
import { downloadObject } from "../util/s3";
interface chatInterface {
  from: String
  to: String
  message: string;
  file?: {
    path: string;
    type: string;
  };
}
export const chatFriend = (payload: chatInterface) => {
  ChatModel.create(payload).catch((err) => {
    console.log(err.message);
  });
};

export const fetchChats = async (req: SessionInterface, res: Response) => {
  try {
    const chats = await ChatModel.find({
      $or: [
        { from: req.session?.id, to: req.params.to },
        { from: req.params.to, to: req.session?.id },
      ],
    }).populate("from", "name email mobile image").lean();

    const modifiledChats = await Promise.all(
      chats.map(async (item)=>{
        if(item.file){
          return ({
            ...item,
            file:{
              path: item.file.path && await downloadObject(item.file.path),
              type: item.file.type
            }
          })
        }
        else{
          return item
        }
      })
    )
    res.json(modifiledChats);
  } catch (error) {
    CatchError(error, res,"failedto fetch chats");
  }
};
