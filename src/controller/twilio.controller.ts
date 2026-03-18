import type { Request, Response } from "express";
import twilio from "twilio";
import { CatchError } from "../util/error";
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

 export const getTurnServers = async(req: Request, res: Response) => {
  try {
    const {iceServers} = await client.tokens.create();
    res.json(iceServers);
  } catch (error) {
    CatchError(error, res, "Failed to generate turn server");
  }
};
