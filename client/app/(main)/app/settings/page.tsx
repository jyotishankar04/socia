"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        // Appearance
        theme: "system",

        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,

        // General
        language: "english",
        defaultPlatform: "twitter",
        autoSaveDrafts: true,

        // Privacy & Safety
        contentModeration: true
    })

    const handleSave = () => {
        console.log("Saving settings:", settings)
        // In a real app, this would make an API call
        alert("Settings saved successfully!")
    }

    const handleReset = () => {
        setSettings({
            theme: "system",
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false,
            language: "english",
            defaultPlatform: "twitter",
            autoSaveDrafts: true,
            contentModeration: true
        })
        alert("Settings reset to defaults!")
    }

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground">Manage your application preferences</p>
                </div>

                {/* Appearance Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize how the app looks and feels</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <Label htmlFor="theme">Theme</Label>
                            <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                                <SelectTrigger id="theme" className="w-full md:w-[200px]">
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

                <Separator />

                {/* Notifications Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-notifications">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                            </div>
                            <Switch
                                id="email-notifications"
                                checked={settings.emailNotifications}
                                onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="push-notifications">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                            </div>
                            <Switch
                                id="push-notifications"
                                checked={settings.pushNotifications}
                                onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                                <p className="text-sm text-muted-foreground">Receive tips, updates, and offers</p>
                            </div>
                            <Switch
                                id="marketing-emails"
                                checked={settings.marketingEmails}
                                onCheckedChange={(checked) => updateSetting("marketingEmails", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* General Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>General application settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="language">Language</Label>
                            <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                                <SelectTrigger id="language" className="w-full md:w-[200px]">
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

                        <div className="space-y-3">
                            <Label htmlFor="default-platform">Default Platform</Label>
                            <Select value={settings.defaultPlatform} onValueChange={(value) => updateSetting("defaultPlatform", value)}>
                                <SelectTrigger id="default-platform" className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="twitter">Twitter/X</SelectItem>
                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    <SelectItem value="facebook">Facebook</SelectItem>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">The platform that will be selected by default</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="auto-save">Auto-save Drafts</Label>
                                <p className="text-sm text-muted-foreground">Automatically save your work as you type</p>
                            </div>
                            <Switch
                                id="auto-save"
                                checked={settings.autoSaveDrafts}
                                onCheckedChange={(checked) => updateSetting("autoSaveDrafts", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* Privacy & Safety Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Privacy & Safety</CardTitle>
                        <CardDescription>Control your privacy settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="content-moderation">Content Moderation</Label>
                                <p className="text-sm text-muted-foreground">Filter potentially inappropriate content</p>
                            </div>
                            <Switch
                                id="content-moderation"
                                checked={settings.contentModeration}
                                onCheckedChange={(checked) => updateSetting("contentModeration", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-6">
                    <Button variant="outline" onClick={handleReset}>
                        Reset to Defaults
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}