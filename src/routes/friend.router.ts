import { Router } from "express";
import { addFriend, deleteFriend, fetchFriends, requestFriend, sugestedFriends, updateFriendStatus } from "../controller/friend.controller";
const FriendRouter =Router()

FriendRouter.post("/",addFriend)
FriendRouter.get("/",fetchFriends)
FriendRouter.get("/suggestion",sugestedFriends)
FriendRouter.get("/request",requestFriend)
FriendRouter.put("/:id",updateFriendStatus)
FriendRouter.get("/:id",deleteFriend)
export default FriendRouter