import express from "express";
import { loginCtrl, logoutCtrl, signupCtrl } from "../controllers/authController.js";


const router = express.Router();
router.post("/signup",signupCtrl);

router.post("/login",loginCtrl);

router.post("/logout",logoutCtrl);

export default router