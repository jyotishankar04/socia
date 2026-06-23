import { PrismaClient, MediaAssetType, MediaSource } from "../../generated/prisma";
import imagekit from "../../config/imagekit";
import openaiImages from "../../config/openai-images";
import { toFile } from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import _env from "../../config";
import createHttpError from "http-errors";
import { buildImagePrompt, buildBannerPrompt, buildCarouselPlan, buildThumbnailPrompt, PLATFORM_SIZES } from "./media-agents";

const prisma = new PrismaClient();

const s3 = new S3Client({
    region: _env.AWS_REGION ?? "us-east-1",
    credentials: {
        accessKeyId: _env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: _env.AWS_SECRET_ACCESS_KEY ?? "",
    },
});

function cleanBase64(dataUrl: string): string {
    return dataUrl.replace(/^data:image\/\w+;base64,/, "");
}

async function uploadUrlToImageKit(url: string, fileName: string): Promise<string> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = response.headers.get("content-type") ?? "image/png";

    const result = await imagekit.upload({
        file: `data:${mimeType};base64,${base64}`,
        fileName,
        folder: "/media-studio",
    });
    return result.url;
}

async function uploadBase64ToImageKit(base64: string, fileName: string): Promise<string> {
    const clean = cleanBase64(base64);
    const result = await imagekit.upload({
        file: clean,
        fileName,
        folder: "/media-studio",
        isBase64: true,
    } as any);
    return result.url;
}

export async function getLibrary(
    userId: string,
    params: { page?: number; limit?: number; type?: MediaAssetType; source?: MediaSource; favorite?: boolean; q?: string }
) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (params.type) where.type = params.type;
    if (params.source) where.source = params.source;
    if (params.favorite) where.isFavorite = true;
    if (params.q) where.name = { contains: params.q, mode: "insensitive" };

    const [items, total] = await Promise.all([
        prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
        prisma.mediaAsset.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function saveAsset(
    userId: string,
    data: { name: string; url: string; type: MediaAssetType; source: MediaSource; size?: number; width?: number; height?: number; metadata?: any }
) {
    return prisma.mediaAsset.create({
        data: { userId, ...data },
    });
}

// gpt-image-1 quality tiers: low=$0.011 | medium=$0.042 | high=$0.167 per 1024x1024
export async function generateImage(params: {
    userId: string;
    prompt: string;
    platform?: string;
    size?: "1024x1024" | "1536x1024" | "1024x1536";
    quality?: "low" | "medium" | "high";
    context?: { chatId?: string; draftId?: string };
}) {
    const { userId, prompt, platform = "instagram", quality = "medium", context } = params;

    const size = (params.size ?? PLATFORM_SIZES[platform] ?? "1024x1024") as "1024x1024" | "1536x1024" | "1024x1536";

    // Agent pipeline: intent → expansion → validation (size passed so composition matches selected frame)
    const { finalPrompt, intent } = await buildImagePrompt(prompt, platform, size);
    const [w, h] = size.split("x").map(Number);

    const response = await openaiImages.images.generate({
        model: "gpt-image-2-2026-04-21",
        prompt: finalPrompt,
        n: 1,
        size,
        quality,
    } as any);

    const b64 = (response as any).data?.[0]?.b64_json as string | undefined;
    if (!b64) throw createHttpError(500, "gpt-image-1 returned no image data");

    const fileName = `generated-${Date.now()}.png`;
    const permanentUrl = await uploadBase64ToImageKit(b64, fileName);

    return prisma.mediaAsset.create({
        data: {
            userId,
            name: fileName,
            url: permanentUrl,
            type: MediaAssetType.IMAGE,
            source: MediaSource.GENERATED,
            width: w,
            height: h,
            metadata: { userPrompt: prompt, finalPrompt, intent: intent as any, model: "gpt-image-1", quality, platform, context } as any,
        },
    });
}

export type EditOperation =
    | "inpaint"
    | "filter"
    | "expand"
    | "remove-background"
    | "replace-background"
    | "remove-object"
    | "add-object"
    | "recolor"
    | "smart-crop"
    | "upscale"
    | "smart-edit";

const OPERATION_INSTRUCTIONS: Record<string, string> = {
    "inpaint": "WHITE pixels = edit area, BLACK = preserve. Seamlessly integrate new content. Match perspective, lighting, shadows. Do not modify pixels outside the white masked area.",
    "filter": "Apply the requested style or filter transformation to the entire image. Preserve the composition and subjects.",
    "expand": "Extend the image naturally beyond its borders. Match the existing style, lighting, perspective, and atmosphere seamlessly.",
    "remove-background": "Remove the background completely. Make the background pure white or transparent. Keep the main subject perfectly intact with clean edges.",
    "replace-background": "Remove the existing background and replace it with the described new background. Keep the main subject exactly as-is. Seamlessly composite the subject into the new environment.",
    "remove-object": "WHITE pixels = area to remove. Remove the selected object(s) seamlessly. Fill the area naturally using content-aware fill that matches the surrounding scene, texture, and lighting.",
    "add-object": "WHITE pixels = area where new content should appear. Add the described object naturally into the selected area. Match lighting, shadows, perspective, and style of the surrounding image.",
    "recolor": "Recolor or change the colors of the image as described. Preserve all textures, shapes, lighting, and composition. Only change the colors.",
    "smart-crop": "Intelligently crop and recompose the image to improve composition. Apply rule of thirds, remove distracting edges, and enhance the focal point.",
    "upscale": "Enhance the image quality: sharpen details, reduce noise, improve clarity, and enhance fine textures while preserving the original composition.",
    "smart-edit": "Apply the described edit to the image intelligently. Understand the intent and apply the best transformation to achieve the result described.",
};

export async function editImage(params: {
    userId: string;
    imageBase64: string;
    maskBase64?: string;
    prompt: string;
    operation: EditOperation;
    aspectRatio?: string;
    context?: { chatId?: string; draftId?: string };
}) {
    const { userId, imageBase64, maskBase64, prompt, operation, context } = params;

    const systemInstruction = OPERATION_INSTRUCTIONS[operation] ?? OPERATION_INSTRUCTIONS["smart-edit"];
    const fullPrompt = `${systemInstruction}\n\nInstruction: ${prompt}`;

    const imageBuffer = Buffer.from(cleanBase64(imageBase64), "base64");
    const imageFile = await toFile(imageBuffer, "image.png", { type: "image/png" });

    const maskOperations = new Set(["inpaint", "remove-object", "add-object"]);
    let maskFile: Awaited<ReturnType<typeof toFile>> | undefined;
    if (maskBase64 && maskOperations.has(operation)) {
        const maskBuffer = Buffer.from(cleanBase64(maskBase64), "base64");
        maskFile = await toFile(maskBuffer, "mask.png", { type: "image/png" });
    }

    const editParams: any = {
        model: "gpt-image-1",
        image: imageFile,
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
    };
    if (maskFile) editParams.mask = maskFile;

    const response = await openaiImages.images.edit(editParams);

    const b64 = (response as any).data?.[0]?.b64_json as string | undefined;
    if (!b64) throw createHttpError(500, "gpt-image-1 returned no image data");

    const resultBase64 = `data:image/png;base64,${b64}`;

    const fileName = `edited-${operation}-${Date.now()}.png`;
    const permanentUrl = await uploadBase64ToImageKit(b64, fileName);

    const asset = await prisma.mediaAsset.create({
        data: {
            userId,
            name: fileName,
            url: permanentUrl,
            type: MediaAssetType.IMAGE,
            source: MediaSource.GENERATED,
            width: 1024,
            height: 1024,
            metadata: { prompt, operation, model: "gpt-image-1", context },
        },
    });

    return { resultBase64, asset };
}

export async function generateBanner(params: {
    userId: string;
    prompt: string;
    bannerType?: string;
    style?: string;
    context?: { chatId?: string; draftId?: string };
}) {
    const { userId, prompt, bannerType = "linkedin", style = "professional", context } = params;

    // Agent pipeline: intent → banner-specific expansion → validation
    const { finalPrompt, intent } = await buildBannerPrompt(prompt, bannerType, style);

    const response = await openaiImages.images.generate({
        model: "gpt-image-1",
        prompt: finalPrompt,
        n: 1,
        size: "1536x1024",
        quality: "high",
    } as any);

    const b64 = (response as any).data?.[0]?.b64_json as string | undefined;
    if (!b64) throw createHttpError(500, "gpt-image-1 returned no image data");

    const fileName = `banner-${Date.now()}.png`;
    const permanentUrl = await uploadBase64ToImageKit(b64, fileName);

    return prisma.mediaAsset.create({
        data: {
            userId,
            name: fileName,
            url: permanentUrl,
            type: MediaAssetType.BANNER,
            source: MediaSource.GENERATED,
            width: 1536,
            height: 1024,
            metadata: { userPrompt: prompt, finalPrompt, intent: intent as any, model: "gpt-image-1", quality: "high", bannerType, style, context } as any,
        },
    });
}

export async function generateCarouselSlides(params: {
    userId: string;
    topic: string;
    slideCount?: number;
    audience?: string;
    tone?: string;
    context?: { chatId?: string; draftId?: string };
}) {
    const { userId, topic, slideCount = 5, audience = "general", tone = "professional", context } = params;

    // Agent pipeline: slide planner → per-slide image prompt builder → validator (all inside buildCarouselPlan)
    const plan = await buildCarouselPlan(topic, slideCount, audience, tone);

    if (!plan.slides.length) throw createHttpError(500, "Failed to generate carousel plan");

    // Generate images for each slide using the agent-crafted prompts (sequential to preserve API rate limits)
    const slideAssets = [];
    for (const slide of plan.slides) {
        const imgResponse = await openaiImages.images.generate({
            model: "gpt-image-1",
            prompt: slide.imagePrompt,
            n: 1,
            size: "1024x1536",
            quality: "low",
        } as any);
        const imgB64 = (imgResponse as any).data?.[0]?.b64_json as string | undefined;
        if (!imgB64) {
            slideAssets.push({ ...slide, imageUrl: "", assetId: "" });
            continue;
        }

        const fileName = `carousel-slide-${slide.slide}-${Date.now()}.png`;
        const permanentUrl = await uploadBase64ToImageKit(imgB64, fileName);

        const asset = await prisma.mediaAsset.create({
            data: {
                userId,
                name: fileName,
                url: permanentUrl,
                type: MediaAssetType.IMAGE,
                source: MediaSource.GENERATED,
                width: 1024,
                height: 1536,
                metadata: { imagePrompt: slide.imagePrompt, visual_concept: slide.visual_concept, masterStyle: plan.masterStyle, stylePreset: plan.stylePreset.name, model: "gpt-image-1", quality: "low", context },
            },
        });

        slideAssets.push({
            ...slide,
            imageUrl: permanentUrl,
            assetId: asset.id,
            style: {
                bgColor: plan.stylePreset.bgColor,
                accentColor: plan.stylePreset.accentColor,
                textColor: plan.stylePreset.textColor,
                badgeStyle: plan.stylePreset.badgeStyle,
                presetName: plan.stylePreset.name,
            },
        });
    }

    const carouselAsset = await prisma.mediaAsset.create({
        data: {
            userId,
            name: `carousel-${topic.slice(0, 40)}-${Date.now()}`,
            url: slideAssets[0]?.imageUrl ?? "",
            type: MediaAssetType.CAROUSEL,
            source: MediaSource.GENERATED,
            metadata: { topic, slideCount, audience, tone, masterStyle: plan.masterStyle, stylePreset: plan.stylePreset as any, slides: slideAssets, context } as any,
        },
    });

    return { asset: carouselAsset, slides: slideAssets };
}

export async function deleteAsset(assetId: string, userId: string) {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
    if (!asset) throw createHttpError(404, "Asset not found");
    if (asset.userId !== userId) throw createHttpError(403, "Forbidden");
    await prisma.mediaAsset.delete({ where: { id: assetId } });
}

export async function toggleFavorite(assetId: string, userId: string) {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
    if (!asset) throw createHttpError(404, "Asset not found");
    if (asset.userId !== userId) throw createHttpError(403, "Forbidden");
    return prisma.mediaAsset.update({
        where: { id: assetId },
        data: { isFavorite: !asset.isFavorite },
    });
}

export async function generateThumbnail(params: {
    userId: string;
    prompt: string;
    platform?: string;
    quality?: "low" | "medium" | "high";
    referenceImage?: string; // base64 data URL — used as reference/person photo
    context?: { chatId?: string; draftId?: string };
}) {
    const { userId, prompt, platform = "youtube", quality = "high", referenceImage, context } = params;

    // Agent pipeline: intent → thumbnail-specific expansion → validation
    const { finalPrompt, intent } = await buildThumbnailPrompt(prompt, platform);

    let b64: string | undefined;

    if (referenceImage) {
        // Use images.edit() so the reference person/image is incorporated
        const refBuffer = Buffer.from(cleanBase64(referenceImage), "base64");
        const refFile = await toFile(refBuffer, "reference.png", { type: "image/png" });
        const editPrompt = `Create a professional thumbnail using this reference image. Incorporate the person/subject from the reference naturally. ${finalPrompt}`;
        const editResponse = await openaiImages.images.edit({
            model: "gpt-image-1",
            image: refFile,
            prompt: editPrompt,
            n: 1,
            size: "1536x1024",
        } as any);
        b64 = (editResponse as any).data?.[0]?.b64_json as string | undefined;
    } else {
        const response = await openaiImages.images.generate({
            model: "gpt-image-1",
            prompt: finalPrompt,
            n: 1,
            size: "1536x1024",
            quality,
        } as any);
        b64 = (response as any).data?.[0]?.b64_json as string | undefined;
    }

    if (!b64) throw createHttpError(500, "gpt-image-1 returned no image data");

    const fileName = `thumbnail-${Date.now()}.png`;
    const permanentUrl = await uploadBase64ToImageKit(b64, fileName);

    return prisma.mediaAsset.create({
        data: {
            userId,
            name: fileName,
            url: permanentUrl,
            type: MediaAssetType.THUMBNAIL,
            source: MediaSource.GENERATED,
            width: 1536,
            height: 1024,
            metadata: { userPrompt: prompt, finalPrompt, intent: intent as any, model: "gpt-image-1", quality, platform, context } as any,
        },
    });
}

export async function getS3PresignedUrl(userId: string, fileName: string, contentType: string) {
    const key = `uploads/${userId}/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
        Bucket: _env.AWS_S3_BUCKET ?? "",
        Key: key,
        ContentType: contentType,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    return { url, key };
}
