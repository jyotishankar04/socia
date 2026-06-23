import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../shared/types";
import * as mediaService from "./media.service";
import { MediaAssetType, MediaSource } from "../../generated/prisma";

export async function getLibrary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        const { page, limit, type, source, favorite, q } = req.query as Record<string, string>;
        const result = await mediaService.getLibrary(userId, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            type: type as MediaAssetType | undefined,
            source: source as MediaSource | undefined,
            favorite: favorite === "true",
            q,
        });
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export async function generateImage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        const { prompt, size, quality, context } = req.body;
        const asset = await mediaService.generateImage({ userId, prompt, size, quality, context });
        res.json({ success: true, data: asset });
    } catch (err) {
        next(err);
    }
}

export async function editImage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        const { imageBase64, maskBase64, prompt, operation, aspectRatio, context } = req.body;
        const result = await mediaService.editImage({ userId, imageBase64, maskBase64, prompt, operation, aspectRatio, context });
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export async function generateBanner(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        const { prompt, bannerType, style, context } = req.body;
        const asset = await mediaService.generateBanner({ userId, prompt, bannerType, style, context });
        res.json({ success: true, data: asset });
    } catch (err) {
        next(err);
    }
}

export async function generateCarousel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        const { topic, slideCount, audience, tone, context } = req.body;
        const result = await mediaService.generateCarouselSlides({ userId, topic, slideCount, audience, tone, context });
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export async function generateThumbnail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        const { prompt, platform, quality, referenceImage, context } = req.body;
        const asset = await mediaService.generateThumbnail({ userId, prompt, platform, quality, referenceImage, context });
        res.json({ success: true, data: asset });
    } catch (err) {
        next(err);
    }
}

export async function saveAsset(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        const asset = await mediaService.saveAsset(userId, req.body);
        res.json({ success: true, data: asset });
    } catch (err) {
        next(err);
    }
}

export async function deleteAsset(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        await mediaService.deleteAsset(req.params.assetId ?? "", userId);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

export async function toggleFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        const asset = await mediaService.toggleFavorite(req.params.assetId ?? "", userId);
        res.json({ success: true, data: asset });
    } catch (err) {
        next(err);
    }
}

export async function getS3PresignedUrl(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.auth.userId!;
        const fileName = (req.query.fileName as string) ?? "";
        const contentType = (req.query.contentType as string) ?? "application/octet-stream";
        const result = await mediaService.getS3PresignedUrl(userId, fileName, contentType);
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}
