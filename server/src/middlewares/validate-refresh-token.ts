import { expressjwt } from "express-jwt";
import logger from "../config/logger";
import _env from "../config";
import type {  IRefreshTokenPayload } from "../shared/types";
import prisma from "../config/prisma";

export const validateRefreshToken = expressjwt({
    secret: _env.JWT_REFRESH_SECRET!,
    algorithms: ["HS256"],
    getToken: (req) => {
        if (req.cookies.refreshToken) {
            return req.cookies.refreshToken;
        }
        return null;
    },
    async isRevoked(req, token) {
        {
            try {
                const sessionId = (token?.payload as IRefreshTokenPayload).sessionId;
                const session = await prisma.session.findUnique({
                    where: { id: sessionId },
                    include: { user: true },
                });
                if(!session) return true

                if (session.expiresAt < new Date()) {
                    return true; // expired = revoked
                }
                return false; // valid = not revoked
            } catch (err) {
                logger.error(
                    "Error validating refresh token: " +
                    err +
                    " " +
                    (token?.payload as IRefreshTokenPayload).sessionId,
                );
                return true;
            }
        }
    },
});