import { Router } from "express";
import { AuthController } from "./auth.controller";
import AuthService from "./auth.service";
import TokenService from "../user/token.service";
import prisma from "../../config/prisma";
import { OtpService } from "../user/otp.service";
import UserService from "../user/user.service";
import { authenticate } from "../../middlewares/auth.middleware";
import { parseRefreshToken } from "../../middlewares/parse-refresh-token";
import { validateRefreshToken } from "../../middlewares/validate-refresh-token";
import type { AuthRequest } from "../../shared/types";

const router = Router();

const tokenService = new TokenService(prisma);
const otpService = new OtpService(prisma);
const authService = new AuthService(prisma);
const userService = new UserService(prisma);
const authController = new AuthController(authService, tokenService, otpService, userService);


router.post("/register", authController.register.bind(authController));
router.post("/verify-otp", authController.verifyOtp.bind(authController));
router.get("/self",authenticate ,(req, res, next) => authController.self(req as AuthRequest, res, next));
router.post("/login", (req, res, next) => authController.login(req as AuthRequest, res, next));
router.get("/logout",authenticate,parseRefreshToken, (req, res, next) => authController.logout(req as AuthRequest, res, next));

router.post("/refresh", validateRefreshToken, (req, res, next) => authController.refreshToken(req as AuthRequest, res, next));

export default router;