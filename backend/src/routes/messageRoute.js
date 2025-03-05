import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getMessagesCtrl, sendMessageCtrl } from "../controllers/messageController.js";
import { objectId } from "../middlewares/objectId.js";

const router = express.Router();

router.get("/:id",objectId,protectRoute, getMessagesCtrl);
router.post("/send/:id",objectId,protectRoute, sendMessageCtrl);
export default router