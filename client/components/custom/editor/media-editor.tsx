"use client"

import { useState, useCallback, useRef } from "react"
import Cropper from "react-easy-crop"
import type { Area, Point } from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw, RotateCw, Loader2 } from "lucide-react"
import { useMediaAuth } from "@/lib/query"
import { toast } from "sonner"
import type { MediaItem } from "@/types"

interface Props {
    item: MediaItem | null
    open: boolean
    onClose: () => void
    onSave: (updated: MediaItem) => void
}

type AspectRatio = "1:1" | "4:3" | "16:9" | "9:16" | "free"

const ASPECT_RATIOS: { label: string; value: AspectRatio; ratio: number | undefined }[] = [
    { label: "1:1", value: "1:1", ratio: 1 },
    { label: "4:3", value: "4:3", ratio: 4 / 3 },
    { label: "16:9", value: "16:9", ratio: 16 / 9 },
    { label: "9:16", value: "9:16", ratio: 9 / 16 },
    { label: "Free", value: "free", ratio: undefined },
]

async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    rotation: number,
    brightness: number,
    contrast: number,
    saturation: number,
): Promise<Blob> {
    const image = await createImageBitmap(await fetch(imageSrc).then(r => r.blob()))
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    const rad = (rotation * Math.PI) / 180
    const sin = Math.abs(Math.sin(rad))
    const cos = Math.abs(Math.cos(rad))
    const rotW = image.width * cos + image.height * sin
    const rotH = image.width * sin + image.height * cos

    const rotCanvas = document.createElement("canvas")
    rotCanvas.width = rotW
    rotCanvas.height = rotH
    const rotCtx = rotCanvas.getContext("2d")!
    rotCtx.translate(rotW / 2, rotH / 2)
    rotCtx.rotate(rad)
    rotCtx.drawImage(image, -image.width / 2, -image.height / 2)

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    const scaleX = rotW / image.width
    const scaleY = rotH / image.height

    ctx.filter = [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
        `saturate(${saturation}%)`,
    ].join(" ")

    ctx.drawImage(
        rotCanvas,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob)
            else reject(new Error("Canvas toBlob failed"))
        }, "image/jpeg", 0.92)
    })
}

export function MediaEditor({ item, open, onClose, onSave }: Props) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1")
    const [brightness, setBrightness] = useState(100)
    const [contrast, setContrast] = useState(100)
    const [saturation, setSaturation] = useState(100)
    const [saving, setSaving] = useState(false)

    const { data: authData } = useMediaAuth()

    const onCropComplete = useCallback((_: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels)
    }, [])

    const handleRotate = (dir: "cw" | "ccw") => {
        setRotation(r => r + (dir === "cw" ? 90 : -90))
    }

    const handleSave = async () => {
        if (!item || !croppedAreaPixels || !authData?.data) return
        setSaving(true)
        try {
            const blob = await getCroppedImg(item.url, croppedAreaPixels, rotation, brightness, contrast, saturation)

            const auth = authData.data
            const formData = new FormData()
            formData.append("file", blob, `edited_${item.name}`)
            formData.append("publicKey", auth.publicKey)
            formData.append("signature", auth.signature)
            formData.append("expire", String(auth.expire))
            formData.append("token", auth.token)
            formData.append("fileName", `edited_${item.name}`)
            formData.append("folder", "/socia-posts")

            const res = await fetch("https://upload.imagekit.io/api/v2/files/upload", {
                method: "POST",
                body: formData,
            })
            const result = await res.json()

            if (!result.url) throw new Error(result.message ?? "Upload failed")

            onSave({
                ...item,
                id: result.fileId || item.id,
                name: `edited_${item.name}`,
                url: result.url,
                width: result.width,
                height: result.height,
                size: result.size || item.size,
            })
            toast.success("Image saved")
            onClose()
        } catch (err) {
            toast.error("Failed to save image")
        } finally {
            setSaving(false)
        }
    }

    const currentRatio = ASPECT_RATIOS.find(r => r.value === aspectRatio)?.ratio

    if (!item) return null

    return (
        <Dialog open={open} onOpenChange={v => { if (!v && !saving) onClose() }}>
            <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-4 pt-4 pb-2">
                    <DialogTitle className="text-sm font-semibold">Edit Image</DialogTitle>
                </DialogHeader>

                {/* Cropper */}
                <div className="relative bg-black" style={{ height: 340 }}>
                    <Cropper
                        image={item.url}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={currentRatio}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                {/* Controls */}
                <div className="px-4 py-3 space-y-4 bg-muted/30 border-t border-border">
                    {/* Aspect ratio */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-20 shrink-0">Aspect</span>
                        <Tabs value={aspectRatio} onValueChange={v => setAspectRatio(v as AspectRatio)}>
                            <TabsList className="h-7 gap-0.5">
                                {ASPECT_RATIOS.map(r => (
                                    <TabsTrigger key={r.value} value={r.value} className="text-[11px] px-2 h-6">
                                        {r.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                        <div className="ml-auto flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRotate("ccw")}>
                                <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRotate("cw")}>
                                <RotateCw className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Zoom */}
                    <SliderRow label="Zoom" value={zoom} min={1} max={3} step={0.01} onChange={v => setZoom(v)} displayValue={`${Math.round(zoom * 100)}%`} />

                    {/* Adjustments */}
                    <SliderRow label="Brightness" value={brightness} min={50} max={150} step={1} onChange={setBrightness} displayValue={`${brightness}%`} />
                    <SliderRow label="Contrast" value={contrast} min={50} max={150} step={1} onChange={setContrast} displayValue={`${contrast}%`} />
                    <SliderRow label="Saturation" value={saturation} min={0} max={200} step={1} onChange={setSaturation} displayValue={`${saturation}%`} />
                </div>

                <DialogFooter className="px-4 py-3 border-t border-border">
                    <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {saving ? "Saving…" : "Save & Replace"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function SliderRow({
    label,
    value,
    min,
    max,
    step,
    onChange,
    displayValue,
}: {
    label: string
    value: number
    min: number
    max: number
    step: number
    onChange: (v: number) => void
    displayValue: string
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
            <Slider
                value={[value]}
                min={min}
                max={max}
                step={step}
                onValueChange={([v]) => onChange(v)}
                className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10 text-right">{displayValue}</span>
        </div>
    )
}
