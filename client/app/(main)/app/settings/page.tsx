"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/custom/shared/page-header"
import { useState } from "react"
import { toast } from "sonner"
import { Bell, Palette, Settings2, Shield, Globe } from "lucide-react"
import { motion } from "motion/react"

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        theme: "system",
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        language: "english",
        defaultPlatform: "linkedin",
        autoSaveDrafts: true,
        contentModeration: true
    })

    const handleSave = () => toast.success("Settings saved successfully.")

    const handleReset = () => {
        setSettings({
            theme: "system",
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false,
            language: "english",
            defaultPlatform: "linkedin",
            autoSaveDrafts: true,
            contentModeration: true
        })
        toast.success("Settings reset to defaults.")
    }

    const update = (key: string, value: boolean | string) => setSettings(prev => ({ ...prev, [key]: value }))

    const tabs = [
        { value: "appearance", label: "Appearance", icon: Palette },
        { value: "notifications", label: "Notifications", icon: Bell },
        { value: "general", label: "General", icon: Settings2 },
        { value: "privacy", label: "Privacy", icon: Shield },
    ]

    return (
        <div className="p-6 space-y-6 max-w-3xl w-full mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <PageHeader
                    title="Settings"
                    description="Manage your application preferences"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
            >
                <Tabs defaultValue="appearance" className="w-full">
                    <TabsList className="w-full justify-start gap-0 bg-transparent p-0 h-auto border-b border-border rounded-none mb-6">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground transition-colors gap-2"
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="appearance" className="space-y-4 mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Appearance</CardTitle>
                                <CardDescription>Customize how the app looks and feels</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-w-xs space-y-2">
                                    <Label htmlFor="theme">Theme</Label>
                                    <Select value={settings.theme} onValueChange={(val) => update("theme", val)}>
                                        <SelectTrigger id="theme">
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4 mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Notifications</CardTitle>
                                <CardDescription>Manage how you receive notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { key: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email" },
                                    { key: "pushNotifications", label: "Push Notifications", description: "Receive push notifications in your browser" },
                                    { key: "marketingEmails", label: "Marketing Emails", description: "Receive tips, updates, and offers" },
                                ].map(({ key, label, description }) => (
                                    <div key={key} className="flex items-center justify-between gap-4">
                                        <div className="space-y-0.5">
                                            <Label htmlFor={key}>{label}</Label>
                                            <p className="text-sm text-muted-foreground">{description}</p>
                                        </div>
                                        <Switch
                                            id={key}
                                            checked={settings[key as keyof typeof settings] as boolean}
                                            onCheckedChange={(checked) => update(key, checked)}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="general" className="space-y-4 mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">General</CardTitle>
                                <CardDescription>General application settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="max-w-xs space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select value={settings.language} onValueChange={(val) => update("language", val)}>
                                        <SelectTrigger id="language">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="spanish">Spanish</SelectItem>
                                            <SelectItem value="french">French</SelectItem>
                                            <SelectItem value="german">German</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="max-w-xs space-y-2">
                                    <Label htmlFor="defaultPlatform">Default Platform</Label>
                                    <Select value={settings.defaultPlatform} onValueChange={(val) => update("defaultPlatform", val)}>
                                        <SelectTrigger id="defaultPlatform">
                                            <SelectValue placeholder="Select platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                                            <SelectItem value="twitter">Twitter/X</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">The platform selected by default when starting a new post</p>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="autoSave">Auto-save Drafts</Label>
                                        <p className="text-sm text-muted-foreground">Automatically save your work as you type</p>
                                    </div>
                                    <Switch
                                        id="autoSave"
                                        checked={settings.autoSaveDrafts}
                                        onCheckedChange={(checked) => update("autoSaveDrafts", checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="privacy" className="space-y-4 mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Privacy & Safety</CardTitle>
                                <CardDescription>Control your privacy settings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="contentModeration">Content Moderation</Label>
                                        <p className="text-sm text-muted-foreground">Filter potentially inappropriate content in AI outputs</p>
                                    </div>
                                    <Switch
                                        id="contentModeration"
                                        checked={settings.contentModeration}
                                        onCheckedChange={(checked) => update("contentModeration", checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex gap-3 justify-end"
            >
                <Button variant="outline" onClick={handleReset}>
                    Reset to Defaults
                </Button>
                <Button onClick={handleSave}>
                    Save Changes
                </Button>
            </motion.div>
        </div>
    )
}
