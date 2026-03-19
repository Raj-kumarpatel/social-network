import type { NextFunction, Response } from "express";
import { CatchError, TryError } from "../util/error";
import UserModel from "../models/user.model";
import moment from "moment";
import type { SessionInterface } from "./auth.middleware";

const RefreshMiddleware = async (
  req: SessionInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw TryError("Failed to refresh token ,401");
    }
    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      throw TryError("Failed to refresh token ,401");
    }
    const today = moment();
    const expiry = moment(user?.refreshTokenExpiry);
    const isExpiry = today.isAfter(expiry);
    if (isExpiry) {
      throw TryError("Failed to refresh token ,401");
    }
    req.session = {
      id: user._id,
      email: user.email,
      mobile: user.mobile,
      name: user.name,
      image: user.image,
    };
    next();
  } catch (error) {
    CatchError(error, res, "Failed to refresh token");
  }
};

export default RefreshMiddleware;
