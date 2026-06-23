"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { useImageStudio } from "@/store/use-image-studio"
import { Upload, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function StudioCanvas() {
    const mainRef = useRef<HTMLCanvasElement>(null)
    const maskRef = useRef<HTMLCanvasElement>(null)
    const overlayRef = useRef<HTMLCanvasElement>(null)

    const { image, mask, selectedTool, brushSize, setMask, pushHistory } = useImageStudio()

    const [dims, setDims] = useState({ w: 1024, h: 1024 })
    const [isDrawing, setIsDrawing] = useState(false)
    const [rectStart, setRectStart] = useState<{ x: number; y: number } | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    const W = dims.w
    const H = dims.h

    // Redraw main canvas when image changes — also detect real dimensions
    useEffect(() => {
        const canvas = mainRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")!
        ctx.clearRect(0, 0, W, H)
        if (!image) return
        const img = new window.Image()
        img.onload = () => {
            const nw = img.naturalWidth
            const nh = img.naturalHeight
            if (nw !== W || nh !== H) {
                setDims({ w: nw, h: nh })
                // canvas size update triggers re-render — draw happens on next effect
                return
            }
            ctx.clearRect(0, 0, nw, nh)
            ctx.drawImage(img, 0, 0, nw, nh)
        }
        img.src = image
    }, [image, W, H])

    // Separate effect: redraw after dims update
    useEffect(() => {
        const canvas = mainRef.current
        if (!canvas || !image) return
        const ctx = canvas.getContext("2d")!
        const img = new window.Image()
        img.onload = () => ctx.drawImage(img, 0, 0, W, H)
        img.src = image
    }, [dims, image, W, H])

    // Redraw mask overlay when mask changes
    useEffect(() => {
        const canvas = maskRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")!
        ctx.clearRect(0, 0, W, H)
        if (!mask) return
        const img = new window.Image()
        img.onload = () => {
            ctx.globalAlpha = 0.45
            ctx.drawImage(img, 0, 0, W, H)
            ctx.globalAlpha = 1
        }
        img.src = mask
    }, [mask, W, H])

    const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = overlayRef.current!.getBoundingClientRect()
        return {
            x: (e.clientX - rect.left) * (W / rect.width),
            y: (e.clientY - rect.top) * (H / rect.height),
        }
    }

    const commitMask = useCallback(() => {
        const maskCanvas = maskRef.current
        if (!maskCanvas) return
        setMask(maskCanvas.toDataURL("image/png"))
    }, [setMask])

    const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!image) return
        const pos = getPos(e)
        if (selectedTool === "RECTANGLE") setRectStart(pos)
        setIsDrawing(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image, selectedTool])

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !image) return
        const pos = getPos(e)
        const maskCtx = maskRef.current?.getContext("2d")
        const overlayCtx = overlayRef.current?.getContext("2d")
        if (!maskCtx || !overlayCtx) return

        if (selectedTool === "BRUSH") {
            maskCtx.globalCompositeOperation = "source-over"
            maskCtx.fillStyle = "rgba(255,60,60,0.6)"
            maskCtx.beginPath()
            maskCtx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2)
            maskCtx.fill()
        } else if (selectedTool === "ERASER") {
            maskCtx.globalCompositeOperation = "destination-out"
            maskCtx.beginPath()
            maskCtx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2)
            maskCtx.fill()
            maskCtx.globalCompositeOperation = "source-over"
        } else if (selectedTool === "RECTANGLE" && rectStart) {
            overlayCtx.clearRect(0, 0, W, H)
            overlayCtx.strokeStyle = "rgba(255,60,60,0.8)"
            overlayCtx.lineWidth = 2
            overlayCtx.setLineDash([4, 4])
            overlayCtx.strokeRect(rectStart.x, rectStart.y, pos.x - rectStart.x, pos.y - rectStart.y)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDrawing, image, selectedTool, brushSize, rectStart, W, H])

    const onMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return
        setIsDrawing(false)

        if (selectedTool === "RECTANGLE" && rectStart) {
            const pos = getPos(e)
            const maskCtx = maskRef.current?.getContext("2d")
            const overlayCtx = overlayRef.current?.getContext("2d")
            if (maskCtx) {
                maskCtx.fillStyle = "rgba(255,60,60,0.6)"
                maskCtx.fillRect(rectStart.x, rectStart.y, pos.x - rectStart.x, pos.y - rectStart.y)
            }
            overlayCtx?.clearRect(0, 0, W, H)
            setRectStart(null)
        }
        commitMask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDrawing, selectedTool, rectStart, commitMask, W, H])

    const loadFile = (file: File) => {
        const reader = new FileReader()
        reader.onload = (ev) => {
            const src = ev.target?.result as string
            maskRef.current?.getContext("2d")?.clearRect(0, 0, W, H)
            setMask(null)
            pushHistory(src)
        }
        reader.readAsDataURL(file)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file?.type.startsWith("image/")) loadFile(file)
    }

    const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) loadFile(file)
    }

    if (!image) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-2xl transition-colors cursor-pointer select-none",
                    isDragOver ? "border-primary bg-primary/5" : "border-zinc-700 bg-zinc-900/50"
                )}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
                onClick={() => document.getElementById("canvas-file-input")?.click()}
            >
                <input id="canvas-file-input" type="file" accept="image/*" className="hidden" onChange={onFileInput} />
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
                    <ImageIcon className="w-7 h-7 text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-300 font-medium">Drop an image or click to upload</p>
                <p className="text-xs text-zinc-600 mt-1.5">Or generate one using the prompt bar below</p>
                <Upload className="w-4 h-4 text-zinc-600 mt-4" />
            </div>
        )
    }

    return (
        /*
         * Outer wrapper fills available space as a flex center.
         * Inner canvas-box constrains itself by both max-width and max-height
         * while preserving the image's true aspect ratio — no squishing.
         */
        <div className="w-full h-full flex items-center justify-center">
            <div
                className="relative rounded-xl overflow-hidden shadow-2xl bg-zinc-950"
                style={{
                    aspectRatio: `${W} / ${H}`,
                    // Fit within the parent on both axes
                    maxWidth: "100%",
                    maxHeight: "100%",
                    // Ensures height is derived from width when width is the constraint,
                    // and width is derived from height when height is the constraint.
                    width: `min(100%, calc(100vh * ${W / H}))`,
                }}
            >
                <canvas ref={mainRef} width={W} height={H} className="absolute inset-0 w-full h-full" />
                <canvas ref={maskRef} width={W} height={H} className="absolute inset-0 w-full h-full" />
                <canvas
                    ref={overlayRef}
                    width={W}
                    height={H}
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        selectedTool === "MOVE" ? "cursor-default"
                        : selectedTool === "ERASER" ? "cursor-cell"
                        : "cursor-crosshair"
                    )}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                />
            </div>
        </div>
    )
}
