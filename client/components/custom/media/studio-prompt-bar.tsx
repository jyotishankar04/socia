"use client"

import { useImageStudio } from "@/store/use-image-studio"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Wand2, Undo2, Redo2, Loader2 } from "lucide-react"

export function StudioPromptBar() {
    const { prompt, setPrompt, isLoading, generateEdit, undo, redo, image, history, historyIndex } = useImageStudio()

    return (
        <div className="flex items-end gap-2 p-3 bg-zinc-900 border-t border-zinc-800">
            <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 shrink-0"
                onClick={undo}
                disabled={historyIndex <= 0}
                title="Undo"
            >
                <Undo2 className="w-4 h-4" />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 shrink-0"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                title="Redo"
            >
                <Redo2 className="w-4 h-4" />
            </Button>
            <Textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe what to change in the selected area..."
                className="flex-1 text-sm bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-none min-h-[36px] max-h-[100px]"
                rows={1}
                onKeyDown={e => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        if (image && prompt && !isLoading) generateEdit()
                    }
                }}
            />
            <Button
                className="gap-1.5 shrink-0 h-9"
                onClick={generateEdit}
                disabled={!image || !prompt || isLoading}
            >
                {isLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Wand2 className="w-4 h-4" />}
                Edit with AI
            </Button>
        </div>
    )
}
