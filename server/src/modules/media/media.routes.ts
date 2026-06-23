import { Router } from "express";
import imagekit from "../../config/imagekit";
import { authenticate } from "../../middlewares/auth.middleware";
import * as mediaController from "./media.controller";
import type { AuthRequest } from "../../shared/types";

const router = Router();

router.get("/auth", authenticate, (_req, res) => {
    const authParams = imagekit.getAuthenticationParameters();
    res.json({
        success: true,
        data: {
            token: authParams.token,
            expire: authParams.expire,
            signature: authParams.signature,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY ?? "",
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ?? "",
        },
    });
});

router.get("/library", authenticate, (req, res, next) => mediaController.getLibrary(req as AuthRequest, res, next));
router.post("/generate/image", authenticate, (req, res, next) => mediaController.generateImage(req as AuthRequest, res, next));
router.post("/generate/banner", authenticate, (req, res, next) => mediaController.generateBanner(req as AuthRequest, res, next));
router.post("/generate/carousel", authenticate, (req, res, next) => mediaController.generateCarousel(req as AuthRequest, res, next));
router.post("/generate/thumbnail", authenticate, (req, res, next) => mediaController.generateThumbnail(req as AuthRequest, res, next));
router.post("/edit", authenticate, (req, res, next) => mediaController.editImage(req as AuthRequest, res, next));
router.post("/save", authenticate, (req, res, next) => mediaController.saveAsset(req as AuthRequest, res, next));
router.delete("/:assetId", authenticate, (req, res, next) => mediaController.deleteAsset(req as AuthRequest, res, next));
router.patch("/:assetId/favorite", authenticate, (req, res, next) => mediaController.toggleFavorite(req as AuthRequest, res, next));
router.get("/s3-presign", authenticate, (req, res, next) => mediaController.getS3PresignedUrl(req as AuthRequest, res, next));

export default router;
