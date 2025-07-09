import e, { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();

router
.route('/')
.post(authController.login);
export default router;