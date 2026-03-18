import { Router } from "express";
import { getUser, login, logout, signup, updateProfilePicture, verifyRefreshToken } from "../controller/user.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import RefreshMiddleware from "../middlewares/refresh.middleware";

const UserRouter = Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.post("/logout", logout);
UserRouter.get("/refresh-token",RefreshMiddleware, verifyRefreshToken);
UserRouter.put("/update-profile",AuthMiddleware,updateProfilePicture)
UserRouter.get("/user", getUser);

export default UserRouter;
