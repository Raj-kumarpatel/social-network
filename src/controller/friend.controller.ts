import type { Request, Response } from "express";
import { CatchError } from "../util/error";
import type { SessionInterface } from "../middlewares/auth.middleware";
import FriendModel from "../models/friend.model";
import UserModel from "../models/user.model";
import mongoose from "mongoose";
import { message } from "antd";

export const addFriend = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id;
    const friend = await FriendModel.create(req.body);
    res.json(friend);
  } catch (error) {
    CatchError(error, res, "failed to send friend request");
  }
};
export const fetchFriends = async (req: SessionInterface, res: Response) => {
  try {
    const userId = req.session?.id;
    const friends = await FriendModel.find({
      status:'accepted',
      $or:[
        {user:userId},
        {friend:userId}
      ]
     }).populate("friend").populate("user");
  const modified =  friends.map((item:any)=>{
       const isUser = item.user._id.toString() === userId
       return {
        _id:item._id,
        friend: isUser ? item.friend : item.user,
        status:item.status,
        createdAt:item.createdAt,
        updatedAt : item.updateAt
       }
     })
    res.json(modified);
  } catch (error) {
    CatchError(error, res, "failed to fetch friends");
  }
};
export const sugestedFriends = async (req: SessionInterface, res: Response) => {
  try {
    const friends = await UserModel.aggregate([
      {$match :{_id :{$ne: new mongoose.Types.ObjectId(req.session?.id)}}},
      { $sample: { size: 5 } },
      { $project: { name: 1, image: 1 ,createdAt:1 } },
    ]);
    
   const user = await Promise.all(friends.map( async(item)=>{
        const count = await FriendModel.countDocuments({friend:item._id})
        return count === 0 ? item :null
    }))
   const suggestedFriend = user.filter((item)=>item !== null)
    res.json(suggestedFriend)
 
  } catch (error) {
    CatchError(error, res, "failed to fetch suggested friends");
  }
};
export const deleteFriend = async (req: Request, res: Response) => {
  try {

      await FriendModel.deleteOne({_id:req.params.id})
       res.json({
        message:"friend deleted successfully"
       })
   
  } catch (error) {
    CatchError(error, res, "failed to delete friends");
  }
};
export const requestFriend = async (req: SessionInterface, res: Response) => {
  try {

     const requestedFriend = await FriendModel.find({friend:req.session?.id,status:"requested"}).populate("user","-password")
       res.json(requestedFriend)
   
  } catch (error) {
    CatchError(error, res, "failed to fetch friends request");
  }
};
export const updateFriendStatus = async (req: SessionInterface, res: Response) => {
  try {

     await FriendModel.updateOne({_id:req.params.id}, {$set:{status:req.body.status}})
     res.json({message:"friend status updated"})
  } catch (error) {
    CatchError(error, res, "failed to update friend status");
  }
};
