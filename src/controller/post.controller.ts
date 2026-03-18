import type { Request, Response } from "express";
import type { SessionInterface } from "../middlewares/auth.middleware";
import PostModel from "../models/post.model";
import { CatchError } from "../util/error";

export const createPost = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id;
    const post = await PostModel.create(req.body);
    res.json({ post, message: "Post created successfully" });
  } catch (error) {
    CatchError(error, res, "failed to create post data");
  }
};

export const fetchPost = async (req: Request, res: Response) => {
  try {
    const fetchData = await PostModel.find().sort({ createdAt: -1 });
    res.json(fetchData);
  } catch (error) {
    CatchError(error, res, "failed to fetch post data");
  }
};
