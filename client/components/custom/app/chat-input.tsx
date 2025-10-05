import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Separator } from "@radix-ui/react-separator"
import { ArrowUpIcon, Image, Linkedin, Paperclip, PlusIcon, TriangleAlert, Twitter } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const ChatInput = () => {
    return (
        <div className="p-1 pt-0 rounded-lg bg-accent/60 w-full  max-w-3xl">
            <div className="flex justify-between items-center p-1">
                <div className="flex items-center">
                    <TriangleAlert className="mr-1 w-4 h-4" />
                    <p>Upgrade to <span className="text-primary">Qwikish Pro</span> for more features and support</p>
                </div>
                <h1 className="text-primary">Upgrade to Pro</h1>
            </div>
            <InputGroup className="w-full">
                <InputGroupTextarea placeholder="Ask, Search or Chat..." />
                <InputGroupAddon align="block-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <InputGroupButton
                                variant="outline"
                                className="rounded-full"
                                size="icon-xs"
                            >
                                <PlusIcon />
                            </InputGroupButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="bottom"
                            align="start"
                            className="[--radius:0.95rem]"
                        >
                            <DropdownMenuItem>
                                <Paperclip className="mr-2" />
                                Files <Badge>Soon</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Image className="mr-2" />
                                Images <Badge>Soon</Badge>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Select  defaultValue="linkedin">
                        <SelectTrigger size="sm">
                            <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                            <SelectGroup>
                                <SelectLabel>Platforms</SelectLabel>
                                <SelectItem value="linkedin">
                                    <Linkedin className="mr-2" />
                                    Linkedin</SelectItem>
                                <SelectItem disabled value="x">
                                    <Twitter className="mr-2" />X <Badge>Soon</Badge></SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputGroupText className="ml-auto"></InputGroupText>
                    <Separator orientation="vertical" className="h-4" />
                    <InputGroupButton
                        variant="default"
                        className="rounded-full"
                        size="icon-xs"
                        disabled
                    >
                        <ArrowUpIcon />
                        <span className="sr-only">Send</span>
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}

export default ChatInput
