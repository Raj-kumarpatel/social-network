import { Router } from "express";
import { getTurnServers } from "../controller/twilio.controller";

const twilioRouter = Router();
twilioRouter.get("/turn-server", getTurnServers);
export default twilioRouter;
