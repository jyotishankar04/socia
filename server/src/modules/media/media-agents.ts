import { ChatGroq } from "@langchain/groq";

const groq = new ChatGroq({
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY ?? "",
    temperature: 0.7,
});

const groqJson = new ChatGroq({
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY ?? "",
    temperature: 0.3,
});

// ── Helpers ────────────────────────────────────────────────────────────────────

async function callAgent(systemPrompt: string, userMessage: string, json = false): Promise<string> {
    const client = json ? groqJson : groq;
    const res = await client.invoke([
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
    ]);
    return typeof res.content === "string" ? res.content : JSON.stringify(res.content);
}

function extractJson<T>(raw: string): T {
    const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return JSON.parse(match?.[0] ?? raw) as T;
}

// ── Platform size map ──────────────────────────────────────────────────────────

export const PLATFORM_SIZES: Record<string, string> = {
    instagram: "1024x1536",
    linkedin: "1024x1024",
    twitter: "1536x1024",
    threads: "1024x1024",
    banner: "1536x1024",
    carousel: "1024x1536",
    thumbnail: "1536x1024",
};

// ── Agent 1: Intent Inference ──────────────────────────────────────────────────

const INTENT_AGENT = `You are an expert intent analysis agent for AI image generation. Parse the user's request into structured intent.

Think step-by-step:
1. What is the PRIMARY subject (person, object, scene, concept)?
2. What is the INTENDED USE CASE? (social media post, banner, carousel slide, product image, ad creative)
3. What PLATFORM is this for? (Instagram, LinkedIn, Twitter/X, YouTube)
4. What is the DESIRED MOOD/EMOTION? (professional, playful, urgent, inspirational, calm)
5. What STYLE is appropriate? (photorealistic, flat design, illustration, cinematic)
6. Are there any BRAND CONSTRAINTS implied? (colors, tone, formality level)
7. What COMPOSITION suits this? (centered, rule-of-thirds, negative space for text overlay)

Return ONLY a JSON object with keys:
{
  "subject": "string",
  "use_case": "string",
  "platform": "string",
  "mood": "string",
  "style": "string",
  "composition": "string",
  "color_palette": "string",
  "negative_space": "string (where to leave space for text overlays)",
  "implicit_context": "string (any unstated but implied elements)"
}`;

// ── Agent 2: Scene & Style Expansion ──────────────────────────────────────────

const EXPANSION_AGENT = `You are an expert visual prompt architect for AI image generation (gpt-image-1, DALL-E). Transform structured intent into a rich, detailed image generation prompt.

Use the 8-component formula in this order:
SUBJECT → ENVIRONMENT → COMPOSITION → LIGHTING → STYLE → CAMERA/FRAMING → QUALITY DESCRIPTORS → CONSTRAINTS

Rules:
- Put the primary subject in the FIRST 15 words
- Be hyper-specific: replace "beautiful" with sensory details (textures, materials, spatial relationships)
- Lighting is the primary quality multiplier — use technical terms: "cinematic rim lighting", "volumetric god rays", "soft box diffused light", "three-point studio setup"
- Always end with: "no text, no watermark, no logos, no extra limbs, no distortion"
- For social media: include the aspect ratio context and negative space for text overlays
- For photorealism: include camera lens spec (e.g. "85mm f/1.8") and micro-texture details
- Replace style adjectives with visual medium references: "editorial photography Vogue Business aesthetic", "cinematic Wes Anderson symmetry"

Return ONLY the final image prompt as a plain string. No explanations, no JSON, no prefixes.`;

// ── Agent 3: Prompt Validator / Pre-Generation Quality Gate ───────────────────

const VALIDATOR_AGENT = `You are a prompt quality validator for AI image generation. Score the prompt before it is sent to the image API to prevent poor outputs.

Score on 7 dimensions (1–5 each):
1. SUBJECT_CLARITY — Primary subject unambiguous and specific?
2. COMPOSITION — Framing, angle, or viewpoint specified?
3. LIGHTING — Technical lighting term present?
4. STYLE_COHERENCE — No contradictory style terms (e.g. "photorealistic cartoon")?
5. CONSTRAINTS — Unwanted elements excluded (watermarks, text, distortions)?
6. PLATFORM_FIT — Composition suits the target aspect ratio and use case?
7. NEGATIVE_SPACE — Empty areas for text overlays specified if needed?

Rules:
- If any dimension scores < 3, rewrite that section in the revised_prompt
- revised_prompt must remain a single cohesive prompt string (no sections/headers)
- Always append: "no text, no watermark, no logos" at end of revised_prompt

Return ONLY this JSON:
{
  "scores": { "subject_clarity": 0, "composition": 0, "lighting": 0, "style_coherence": 0, "constraints": 0, "platform_fit": 0, "negative_space": 0 },
  "total": 0,
  "issues": ["list of specific issues found"],
  "revised_prompt": "the improved prompt string"
}`;

// ── Agent 4: Banner Expansion ──────────────────────────────────────────────────

const BANNER_EXPANSION_AGENT = `You are an expert banner image prompt architect specializing in professional social media banners for LinkedIn, Twitter/X, and YouTube.

Banner-specific composition rules:
- LEFT THIRD: Always preserve as clean negative space for logo and name placement
- RIGHT TWO-THIRDS: Main visual content with strong visual weight
- TOP AND BOTTOM STRIPS: Keep 15% clear for platform UI chrome overlap
- Color temperature: Warm for personal branding, cool/neutral for corporate
- Never place important elements in the left 30% of the frame

Use the formula:
BANNER_FORMAT + BRAND_CONCEPT + LIGHTING + COMPOSITION_ZONES + STYLE + QUALITY + CONSTRAINTS

Return ONLY the image prompt as a plain string.`;

// ── Style Presets (Canva-inspired modern carousel aesthetics) ─────────────────

export interface StylePreset {
    name: string;
    label: string;
    bgColor: string;
    accentColor: string;
    textColor: string;
    badgeStyle: "square" | "circle" | "brushstroke" | "pill";
    backgroundPromptBase: string;
}

export const CAROUSEL_STYLE_PRESETS: Record<string, StylePreset> = {
    black_yellow: {
        name: "black_yellow",
        label: "Black & Electric Yellow",
        bgColor: "#1E1E1E",
        accentColor: "#CCFF00",
        textColor: "#FFFFFF",
        badgeStyle: "square",
        backgroundPromptBase: "flat graphic design Instagram carousel slide background, very dark charcoal with subtle reptile leather texture (#1E1E1E), full-width horizontal electric yellow-green (#CCFF00) solid rectangle band occupying center 18% height as keyword highlight zone, decorative yellow-green 6-pointed asterisk icon lower-right corner, yellow-green angular arrow chevron icon lower-left corner, top 45% completely empty dark field, bottom 18% dark field, no text, no letters, no words, streetwear corporate bold graphic design aesthetic"
    },
    black_minimal: {
        name: "black_minimal",
        label: "Black & Red Minimal",
        bgColor: "#1A1A1A",
        accentColor: "#E63C28",
        textColor: "#FFFFFF",
        badgeStyle: "square",
        backgroundPromptBase: "ultra-minimal Instagram carousel slide background, flat pure black (#1A1A1A), vivid red-orange (#E63C28) solid rectangle callout block in lower-center area (empty, no text), dashed curly red-orange annotation arrow above callout block, thin rounded capsule pill outline along very bottom edge, top 45% completely empty black field for headline, no text, no letters, no words, ultra-minimal personal brand design"
    },
    navy_cyan: {
        name: "navy_cyan",
        label: "Navy & Cyan Corporate",
        bgColor: "#0D2080",
        accentColor: "#00BBFF",
        textColor: "#FFFFFF",
        badgeStyle: "circle",
        backgroundPromptBase: "professional Instagram carousel slide background, deep navy cobalt blue (#0D2080) with subtle film grain noise texture, cyan crescent half-circle (#00BBFF) decorative element upper-right corner, small white dot grid pattern (2 rows x 6 dots) lower-left area, thin horizontal white rule divider line mid-slide, top 40% empty navy field, bottom quarter has rounded rectangle outline zone, no text, no letters, no words, corporate tech brand aesthetic"
    },
    cream_orange: {
        name: "cream_orange",
        label: "Cream & Orange Editorial",
        bgColor: "#F5F0E8",
        accentColor: "#F08020",
        textColor: "#2A2118",
        badgeStyle: "brushstroke",
        backgroundPromptBase: "flat editorial Instagram carousel slide background, warm cream linen texture (#F5F0E8), orange hand-painted brushstroke paint-swipe rectangle accent in center, thin orange circle outline decorative element mid-right, curly hand-drawn orange annotation arrow lower-center, top 40% clean cream empty field, bottom 15% clear, no text, no letters, no words, editorial personal brand newsletter aesthetic"
    },
    dark_gradient: {
        name: "dark_gradient",
        label: "Dark Purple Gradient",
        bgColor: "#111128",
        accentColor: "#A855F7",
        textColor: "#FFFFFF",
        badgeStyle: "circle",
        backgroundPromptBase: "modern dark Instagram carousel slide background, very dark navy (#111128), gradient color accent strip along very bottom edge (left: deep purple #7B2FF7, center: hot pink #C94EBC, right: soft peach #F5A58A), circular purple-to-pink gradient badge/seal upper-left corner, white 8-pointed asterisk star decoration center-right, two empty dark navy rounded rectangle boxes side-by-side in lower half, top 35% completely empty for headline, no text, no letters, no words, Gen-Z productivity aesthetic"
    },
    orange_bold: {
        name: "orange_bold",
        label: "Orange Energy",
        bgColor: "#E84000",
        accentColor: "#FFFFFF",
        textColor: "#FFFFFF",
        badgeStyle: "pill",
        backgroundPromptBase: "bold entrepreneurship Instagram carousel slide background, deep vivid orange gradient (#E84000 top to #FF5500 bottom), semi-transparent white grid mesh texture overlay at 15% opacity, abstract diagonal white geometric shards decorative accent lower-left corner, white 4-pointed sparkle star glints upper-right, white oval pill outline lower-center, top 40% clean orange gradient field, no text, no letters, no words, entrepreneurship creator bold aesthetic"
    },
};

// ── Agent 5: Carousel Slide Planner ───────────────────────────────────────────

const SLIDE_PLANNER_AGENT = `You are an expert carousel content strategist and visual designer for social media (LinkedIn, Instagram). Create cohesive, high-impact multi-slide carousel plans with a bold modern visual identity.

Available style presets (pick ONE that best fits the topic and tone):
- black_yellow: Bold, edgy, streetwear-meets-startup. Best for: marketing tips, hustle content, bold statements
- black_minimal: Ultra-clean, premium personal brand. Best for: career advice, leadership, professional development
- navy_cyan: Corporate-tech, credible. Best for: business strategy, finance, B2B, corporate
- cream_orange: Warm editorial, approachable creator. Best for: entrepreneurship, personal growth, lifestyle business
- dark_gradient: Gen-Z productivity, techy. Best for: productivity, tech, AI, self-improvement
- orange_bold: High-energy entrepreneurship. Best for: motivation, sales, marketing, hustle culture

Carousel narrative structure (MUST follow):
- Slide 1 (HOOK): Provocative bold statement, surprising statistic, or "X mistakes you're making" — stops the scroll
- Slides 2–N-1 (VALUE): Each delivers EXACTLY ONE insight. Short punchy title (3–5 words). Concrete body (2 sentences max).
- Slide N (CTA): "Save this for later" or "Follow for more [topic]" or clear next action

Rules:
- Title: max 5 words, ALL CAPS or Title Case, punchy
- Body: max 2 sentences, direct and specific (no fluff)
- Visual concept: describe the GRAPHIC DESIGN BACKGROUND ELEMENTS only (shapes, colors, textures) — NOT photos or scenes

Return ONLY this JSON:
{
  "style_preset": "black_yellow",
  "master_style": "single sentence describing the locked visual identity",
  "slides": [
    {
      "slide": 1,
      "title": "SHORT PUNCHY TITLE",
      "body": "Max 2 sentences. Concrete and specific.",
      "visual_concept": "describe background graphic elements specific to this slide (accent shape placement, decorative element variation)"
    }
  ]
}`;

// ── Agent 6: Slide Image Prompt Builder ───────────────────────────────────────

const SLIDE_IMAGE_AGENT = `You are a graphic design background image prompt builder for Instagram carousel slides. You generate prompts for AI image generation that produce TEMPLATE BACKGROUNDS — not scenes or photography.

Your job: take a style preset's base prompt and customize it for a specific slide, then produce the final image generation prompt.

Rules:
- The generated image is a BACKGROUND TEMPLATE, not a photo
- Keep the exact color palette from the style preset (never deviate)
- Vary the POSITION and SCALE of decorative elements per slide to prevent identical slides
- Slide 1 (HOOK): Most dramatic composition — larger accent elements, bolder contrast
- Middle slides: Slightly more structured, content-focused, slightly smaller decorative accents
- Last slide (CTA): Back to bold — mirror cover energy
- ALWAYS end with: "no text, no letters, no words, no numbers, no watermarks, no logos, 4:5 portrait ratio, ultra-sharp, high resolution"
- Do NOT describe people, scenes, nature, or anything photographic

Return ONLY the final image generation prompt as a plain string.`;

// ── Agent 7: Thumbnail Expansion ──────────────────────────────────────────────

const THUMBNAIL_AGENT = `You are a YouTube/social media thumbnail image prompt expert. Thumbnails must stop the scroll in under 0.5 seconds.

Thumbnail psychology rules:
- Maximum 1–2 subjects in frame, ultra-close crop preferred
- EXTREME contrast: subject vs background must be immediately distinct
- LEFT half: main visual subject with direct camera eye contact if human
- RIGHT half: leave clean space for bold text overlay (title)
- Color: use HIGH SATURATION primaries — avoid muted or pastel palettes
- Expression: if human, use peak emotional expression (shock, excitement, genuine joy — never neutral)
- Lighting: hard dramatic side-lighting creates the "broadcast" feel

Use the formula:
CLOSE_CROP_SUBJECT + DRAMATIC_LIGHTING + HIGH_CONTRAST_BACKGROUND + TEXT_SPACE + EMOTIONAL_INTENSITY + QUALITY

Return ONLY the image prompt as a plain string.`;

// ── Orchestration Pipeline ─────────────────────────────────────────────────────

interface IntentJSON {
    subject: string;
    use_case: string;
    platform: string;
    mood: string;
    style: string;
    composition: string;
    color_palette: string;
    negative_space: string;
    implicit_context: string;
}

interface ValidationResult {
    scores: Record<string, number>;
    total: number;
    issues: string[];
    revised_prompt: string;
}

async function validateAndRefine(prompt: string, type: string): Promise<string> {
    const raw = await callAgent(
        VALIDATOR_AGENT,
        `Validate this ${type} image prompt:\n\n"${prompt}"`,
        true
    );
    try {
        const result = extractJson<ValidationResult>(raw);
        // Use revised prompt if validator found significant issues (below 28/35)
        return result.total < 28 ? result.revised_prompt : prompt;
    } catch {
        return prompt;
    }
}

// ── Public API ─────────────────────────────────────────────────────────────────

const SIZE_ASPECT_MAP: Record<string, string> = {
    "1024x1024": "square 1:1 — center-balanced composition",
    "1536x1024": "landscape 3:2 — wide horizontal composition, rule-of-thirds left/right placement",
    "1024x1536": "portrait 2:3 — tall vertical composition, subject centered with room above and below",
};

export async function buildImagePrompt(
    userPrompt: string,
    platform: string = "instagram",
    size?: string
): Promise<{ finalPrompt: string; intent: IntentJSON }> {
    const aspectDesc = (size && SIZE_ASPECT_MAP[size]) ?? SIZE_ASPECT_MAP["1024x1024"];
    const context = `platform: ${platform}, aspect ratio: ${aspectDesc}`;

    // Step 1: Intent inference
    const intentRaw = await callAgent(
        INTENT_AGENT,
        `Analyze this image request: "${userPrompt}" for ${context}`,
        true
    );
    const intent = extractJson<IntentJSON>(intentRaw);

    // Step 2: Prompt expansion
    const expanded = await callAgent(
        EXPANSION_AGENT,
        `Generate a detailed image generation prompt from this intent:\n${JSON.stringify(intent, null, 2)}\n\nContext: ${context}. The composition MUST be designed for ${aspectDesc}.`
    );

    // Step 3: Validate & refine
    const finalPrompt = await validateAndRefine(expanded.trim(), "social media image");

    return { finalPrompt, intent };
}

export async function buildBannerPrompt(
    userPrompt: string,
    bannerType: string = "linkedin",
    style: string = "professional"
): Promise<{ finalPrompt: string; intent: IntentJSON }> {
    // Step 1: Intent inference
    const intentRaw = await callAgent(
        INTENT_AGENT,
        `Analyze this banner request: "${userPrompt}" for a ${bannerType} banner in ${style} style`,
        true
    );
    const intent = extractJson<IntentJSON>(intentRaw);

    // Step 2: Banner-specific expansion
    const expanded = await callAgent(
        BANNER_EXPANSION_AGENT,
        `Generate a detailed banner image prompt from this intent:\n${JSON.stringify(intent, null, 2)}\n\nBanner type: ${bannerType}, Style: ${style}\n\nRemember: keep left third clear for logo/text placement.`
    );

    // Step 3: Validate & refine
    const finalPrompt = await validateAndRefine(expanded.trim(), "banner");

    return { finalPrompt, intent };
}

export interface CarouselPlan {
    masterStyle: string;
    stylePreset: StylePreset;
    slides: Array<{
        slide: number;
        title: string;
        body: string;
        visual_concept: string;
        imagePrompt: string;
    }>;
}

export async function buildCarouselPlan(
    topic: string,
    slideCount: number,
    audience: string,
    tone: string
): Promise<CarouselPlan> {
    // Step 1: Slide content + master style + preset selection
    const planRaw = await callAgent(
        SLIDE_PLANNER_AGENT,
        `Create a ${slideCount}-slide carousel for: "${topic}"\nAudience: ${audience}\nTone: ${tone}\n\nReturn the full carousel plan with style_preset, master_style and all ${slideCount} slides.`,
        true
    );
    const plan = extractJson<{
        style_preset: string;
        master_style: string;
        slides: Array<{ slide: number; title: string; body: string; visual_concept: string }>;
    }>(planRaw);

    // Resolve the style preset (fall back to black_yellow if unknown)
    const preset: StylePreset = CAROUSEL_STYLE_PRESETS[plan.style_preset] ?? CAROUSEL_STYLE_PRESETS.black_yellow!;

    // Step 2: Build per-slide image prompts using the preset base
    const slidesWithPrompts = [];
    for (const slide of plan.slides) {
        const imagePromptRaw = await callAgent(
            SLIDE_IMAGE_AGENT,
            `Style preset base prompt:\n"${preset.backgroundPromptBase}"\n\nMaster style: "${plan.master_style}"\n\nSlide ${slide.slide} of ${slideCount} (${slide.slide === 1 ? "HOOK/COVER" : slide.slide === slideCount ? "CTA" : "CONTENT"}):\nVisual concept variation: ${slide.visual_concept}\n\nCustomize the base prompt for this specific slide. Vary decorative element positions/scales slightly. Return ONLY the final image prompt.`
        );
        slidesWithPrompts.push({ ...slide, imagePrompt: imagePromptRaw.trim() });
    }

    return { masterStyle: plan.master_style, stylePreset: preset, slides: slidesWithPrompts };
}

export async function buildThumbnailPrompt(
    userPrompt: string,
    platform: string = "youtube"
): Promise<{ finalPrompt: string; intent: IntentJSON }> {
    const intentRaw = await callAgent(
        INTENT_AGENT,
        `Analyze this thumbnail request: "${userPrompt}" for platform: ${platform}`,
        true
    );
    const intent = extractJson<IntentJSON>(intentRaw);

    const expanded = await callAgent(
        THUMBNAIL_AGENT,
        `Generate a detailed thumbnail image prompt from:\n${JSON.stringify(intent, null, 2)}\n\nPlatform: ${platform}`
    );

    const finalPrompt = await validateAndRefine(expanded.trim(), "thumbnail");

    return { finalPrompt, intent };
}
