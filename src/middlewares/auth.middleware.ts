import { Request, Response, NextFunction } from "express";
import { CatchError, TryError } from "../util/error";
import jwt, { JwtPayload } from "jsonwebtoken";
import  mongoose from "mongoose";

 export interface PayloadInterface {
    id:mongoose.Types.ObjectId
    name : string 
    email : string 
    mobile : string
    image: string | null
  }

 export interface SessionInterface extends Request {
    session? : PayloadInterface
}
const AuthMiddleware = async (
  req: SessionInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw TryError("Unauthorised User", 401);
    const payload = await jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;
    req.session = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        mobile: payload.mobile,
        image : payload.image

    }
    next();
  } catch (error) {
    CatchError(error, res, "Unauthorised User");
  }
};

export default AuthMiddleware
