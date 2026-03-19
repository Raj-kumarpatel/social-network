import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import { CatchError, TryError } from "../util/error";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import moment from "moment";
import type {
  PayloadInterface,
  SessionInterface,
} from "../middlewares/auth.middleware";


type TokenType = "at" | "rt";

const getOptions = (TokenType: TokenType) => {
  const options = {
    httpOnly: true,
    secure: false,
    maxAge: TokenType === "at" ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
  };
  return options;
};
const generateToken = (payload: PayloadInterface) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "15m",
  });
  const refreshToken = uuid();
  return { accessToken, refreshToken };
};

export const signup = async (req: Request, res: Response) => {
  try {
    const data = await UserModel.create(req.body);
    res.status(201).json({ message: "Sign up successfull", data });
  } catch (error: unknown) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
    else {
      res.status(500).json({ message: "An Unknown error occured" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw TryError("User not found, please try to sign first", 400);
    }
    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin) {
      throw TryError("Invalid credentials email or password is incorrect", 401);
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      // image:user.image ? await downloadObject(user.image) : null
      image:user.image 
    };

    const { accessToken, refreshToken } = generateToken(payload);
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken,
          refreshTokenExpiry: moment().add(7, "days").toDate(),
        },
      },
    );

    res
      .cookie("accessToken", accessToken, getOptions("at"))
      .cookie("refreshToken", refreshToken, getOptions("rt"))
      .json({ message: "Login successful" });
  } catch (error: unknown) {
    CatchError(error, res, "Login failed please try after sometime");
  }
};

export const logout = async (req: SessionInterface, res: Response) => {
  const option = {
    httpOnly: true,
    secure: false,
    maxAge: 0,
  };
  res.clearCookie("accessToken", option).clearCookie("refreshToken", option);

  await UserModel.updateOne(
    { _id: req.session?.id },
    { $set: { refreshToken: null, refreshTokenExpiry: null } },
  );
  res.status(200).json("User loggedout successfully!");
};

export const verifyRefreshToken = async (
  req: SessionInterface,
  res: Response,
) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      throw TryError("Failed to refresh token", 401);
    }

    const user = await UserModel.findOne({ refreshToken: token });
    if (!user) {
      throw TryError("Invalid refresh token", 401);
    }

    if (moment().isAfter(moment(user.refreshTokenExpiry))) {
      throw TryError("Refresh token expired", 401);
    }

    req.session = {
      id: user._id,
      email: user.email,
      mobile: user.mobile,
      name: user.name,
      // image: user.image ? await downloadObject(user.image) : null,
      image: user.image
    };

    const { accessToken, refreshToken } = generateToken(req.session);

    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken,
          refreshTokenExpiry: moment().add(7, "days").toDate(),
        },
      },
    );

    return res
      .cookie("accessToken", accessToken, getOptions("at"))
      .cookie("refreshToken", refreshToken, getOptions("rt"))
      .json({ message: "Access token refreshed successfully" });
  } catch (err: unknown) {
    CatchError(err, res, "Failed to refresh token");
  }
};

export const updateProfilePicture = async (
  req: SessionInterface,
  res: Response,
) => {
  try {
    const path = `${process.env.S3_URL}/${req.body.path}`;
    if (!path) {
      throw TryError("failed to update profile picture ,400");
    }
    await UserModel.updateOne(
      { _id: req.session?.id },
      { $set: { image: path } },
    );
    // const url = await downloadObject(path);
    res.json({ image: path });
  } catch (error) {
    CatchError(error, res, "failed to update profile picture");
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) throw TryError("Invalid session", 401);

    const session = (await jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY!,
    )) as JwtPayload;
    const user = await UserModel.findById(session.id).select("-password");

    if (!user) {
      throw TryError("User not found", 404);
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      // image: user.image  ? await downloadObject(user.image) : null,
      image: user.image
    };
    res.json(payload);
  } catch (err) {
    CatchError(err, res, "Invalid session");
  }
};
