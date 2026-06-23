"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/custom/shared/page-header"
import { Building2, Globe, Mail, User, Camera, Link2, Unlink, Settings2, CreditCard, BarChart3 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { motion } from "motion/react"

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        fullName: "Alex Johnson",
        email: "alex.johnson@example.com",
        company: "TechCorp Inc.",
        website: "https://alexjohnson.dev",
        bio: "Digital marketing specialist with 5+ years of experience in social media management and content strategy. Passionate about helping brands tell their stories through engaging content."
    })

    const plan = {
        name: "Pro Plan",
        status: "active",
        description: "Advanced features for professional content creators",
        billingCycle: "Monthly",
        nextBilling: "Jan 15, 2024"
    }

    const usage = {
        postsCreated: 247,
        totalEngagement: "12.5K",
        daysActive: 186
    }

    const [platforms, setPlatforms] = useState([
        { name: "Twitter", connected: true },
        { name: "LinkedIn", connected: true },
        { name: "Facebook", connected: false },
        { name: "Instagram", connected: true },
        { name: "TikTok", connected: false }
    ])

    const maxBioLength = 500

    const handleSave = () => toast.success("Profile saved successfully.")
    const onManageSubscription = () => toast.info("Redirecting to subscription management…")

    const onConnect = (platformName: string) => {
        setPlatforms(prev => prev.map(p => p.name === platformName ? { ...p, connected: true } : p))
        toast.success(`${platformName} connected.`)
    }

    const onDisconnect = (platformName: string) => {
        setPlatforms(prev => prev.map(p => p.name === platformName ? { ...p, connected: false } : p))
        toast.success(`${platformName} disconnected.`)
    }

    const initials = profile.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(n => n[0].toUpperCase())
        .join("")

    const tabs = [
        { value: "info", label: "Profile Info", icon: User },
        { value: "platforms", label: "Connected Platforms", icon: Link2 },
        { value: "plan", label: "Plan & Usage", icon: BarChart3 },
    ]

    return (
        <div className="p-6 space-y-6 max-w-3xl w-full mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <PageHeader
                    title="Profile"
                    description="Manage your personal information and connected accounts"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
            >
                <Card className="overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                            <div className="relative">
                                <Avatar className="h-20 w-20 ring-4 ring-background">
                                    <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors">
                                    <Camera className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-foreground">{profile.fullName}</h2>
                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                            </div>
                            <Button size="sm" onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Tabs defaultValue="info">
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

                    <TabsContent value="info" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Personal Information</CardTitle>
                                <CardDescription>Update your account details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={profile.fullName}
                                            onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5" />
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company" className="flex items-center gap-1.5">
                                            <Building2 className="h-3.5 w-3.5" />
                                            Company
                                        </Label>
                                        <Input
                                            id="company"
                                            value={profile.company}
                                            onChange={(e) => setProfile(p => ({ ...p, company: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website" className="flex items-center gap-1.5">
                                            <Globe className="h-3.5 w-3.5" />
                                            Website
                                        </Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={profile.website}
                                            onChange={(e) => setProfile(p => ({ ...p, website: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={profile.bio}
                                        onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                                        className="min-h-[100px] resize-none"
                                        maxLength={maxBioLength}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {profile.bio.length} / {maxBioLength}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="platforms" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Connected Platforms</CardTitle>
                                <CardDescription>Manage your social media connections</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {platforms.map((platform) => (
                                    <div
                                        key={platform.name}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center font-semibold text-sm">
                                                {platform.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{platform.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {platform.connected ? "Connected" : "Not connected"}
                                                </p>
                                            </div>
                                        </div>
                                        {platform.connected ? (
                                            <Button variant="outline" size="sm" onClick={() => onDisconnect(platform.name)}>
                                                <Unlink className="w-3.5 h-3.5 mr-1.5" />
                                                Disconnect
                                            </Button>
                                        ) : (
                                            <Button size="sm" onClick={() => onConnect(platform.name)}>
                                                <Link2 className="w-3.5 h-3.5 mr-1.5" />
                                                Connect
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="plan" className="mt-0 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-yellow-500" />
                                    Current Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                    </div>
                                    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Active</Badge>
                                </div>
                                <div className="space-y-1.5 pt-1 border-t border-border">
                                    <div className="flex justify-between text-sm mt-2">
                                        <span className="text-muted-foreground">Billing cycle</span>
                                        <span className="font-medium">{plan.billingCycle}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Next billing</span>
                                        <span className="font-medium">{plan.nextBilling}</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full" onClick={onManageSubscription}>
                                    <Settings2 className="w-4 h-4 mr-1.5" />
                                    Manage Subscription
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Usage Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-foreground">{usage.postsCreated.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Posts Created</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-foreground">{usage.totalEngagement}</p>
                                        <p className="text-xs text-muted-foreground">Total Engagement</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-foreground">{usage.daysActive}</p>
                                        <p className="text-xs text-muted-foreground">Days Active</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    )
}
