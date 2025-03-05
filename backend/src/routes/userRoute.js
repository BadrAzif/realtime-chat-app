import express from 'express';
import { protectRoute } from "../middlewares/protectRoute.js";
import { getAllUsersCtrl } from '../controllers/userController.js';

const router = express.Router();
router.get("/",protectRoute, getAllUsersCtrl);
export default router
