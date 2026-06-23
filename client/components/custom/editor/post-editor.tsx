"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import LinkExtension from "@tiptap/extension-link"
import { cn } from "@/lib/utils"
import { Bold, Italic, List, ListOrdered, Link, Quote, Undo, Redo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEffect, useRef } from "react"

interface PostEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    className?: string
}

function plainToHtml(text: string) {
    return `<p>${text.replace(/\n/g, "</p><p>")}</p>`
}

export function PostEditor({ content, onChange, placeholder, className }: PostEditorProps) {
    // Track the last content we pushed INTO the editor so the sync effect
    // can skip updates that originated from the editor's own onUpdate.
    const lastPushed = useRef(content)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
                horizontalRule: false,
                hardBreak: false,
            }),
            Placeholder.configure({
                placeholder: placeholder || "Write your post content...",
            }),
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-primary underline" },
            }),
        ],
        content: content ? plainToHtml(content) : "",
        onUpdate: ({ editor }) => {
            // Use blockSeparator: '\n' so getText never produces \n\n between paragraphs.
            const text = editor.getText({ blockSeparator: "\n" })
            lastPushed.current = text
            onChange(text)
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] text-sm leading-relaxed",
            },
        },
    })

    // Only sync when content changed externally (e.g. version switch), not from onUpdate.
    useEffect(() => {
        if (!editor || content === lastPushed.current) return
        lastPushed.current = content
        editor.commands.setContent(content ? plainToHtml(content) : "")
    }, [content, editor])

    if (!editor) return null

    const toggleLink = () => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("Enter URL", previousUrl || "")
        if (url === null) return
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    const ToolbarButton = ({ active, onClick, icon: Icon, title }: { active?: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; title: string }) => (
        <Button
            variant={active ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={onClick}
            title={title}
        >
            <Icon className="w-3.5 h-3.5" />
        </Button>
    )

    return (
        <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
            <div className="flex items-center gap-0.5 px-2 py-1 border-b border-border bg-muted/30">
                <ToolbarButton
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    icon={Bold}
                    title="Bold"
                />
                <ToolbarButton
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    icon={Italic}
                    title="Italic"
                />
                <Separator orientation="vertical" className="h-4 mx-1" />
                <ToolbarButton
                    active={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    icon={List}
                    title="Bullet List"
                />
                <ToolbarButton
                    active={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    icon={ListOrdered}
                    title="Ordered List"
                />
                <ToolbarButton
                    active={editor.isActive("blockquote")}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    icon={Quote}
                    title="Quote"
                />
                <ToolbarButton
                    active={editor.isActive("link")}
                    onClick={toggleLink}
                    icon={Link}
                    title="Add Link"
                />
                <Separator orientation="vertical" className="h-4 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    icon={Undo}
                    title="Undo"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    icon={Redo}
                    title="Redo"
                />
            </div>
            <div className="px-4 py-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
