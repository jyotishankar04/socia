"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building2, Crown, FileText, Globe, Mail, TrendingUp, User, Calendar } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
    // Dummy data for profile
    const [profile, setProfile] = useState({
        fullName: "Alex Johnson",
        email: "alex.johnson@example.com",
        company: "TechCorp Inc.",
        website: "https://alexjohnson.dev",
        bio: "Digital marketing specialist with 5+ years of experience in social media management and content strategy. Passionate about helping brands tell their stories through engaging content."
    })

    // Dummy data for plan
    const plan = {
        name: "Pro Plan",
        status: "active",
        description: "Advanced features for professional content creators",
        billingCycle: "Monthly",
        nextBilling: "Jan 15, 2024"
    }

    // Dummy data for usage statistics
    const usage = {
        postsCreated: 247,
        totalEngagement: "12.5K",
        daysActive: 186
    }

    // Dummy data for connected platforms
    const platforms = [
        { name: "Twitter", connected: true },
        { name: "LinkedIn", connected: true },
        { name: "Facebook", connected: false },
        { name: "Instagram", connected: true },
        { name: "TikTok", connected: false }
    ]

    const maxBioLength = 500

    // Mock functions
    const handleSave = () => {
        console.log("Saving profile:", profile)
        // In a real app, this would make an API call
        alert("Profile saved successfully!")
    }

    const onManageSubscription = () => {
        console.log("Managing subscription")
        // In a real app, this would navigate to subscription management
        alert("Redirecting to subscription management...")
    }

    const onConnect = (platformName: string) => {
        console.log(`Connecting to ${platformName}`)
        // In a real app, this would initiate OAuth flow
        alert(`Connecting to ${platformName}...`)
    }

    const onDisconnect = (platformName: string) => {
        console.log(`Disconnecting from ${platformName}`)
        // In a real app, this would disconnect the platform
        alert(`Disconnecting from ${platformName}...`)
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Personal Information */}
                    <div className="lg:col-span-2">
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your account details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarFallback className="text-2xl bg-muted">
                                            {profile.fullName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Button variant="outline" size="sm">
                                            Change Avatar
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={profile.fullName}
                                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                            className="bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company" className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            Company
                                        </Label>
                                        <Input
                                            id="company"
                                            value={profile.company}
                                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                            className="bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website" className="flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            Website
                                        </Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={profile.website}
                                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                            className="bg-background"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="bg-background min-h-[100px] resize-none"
                                        maxLength={maxBioLength}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {profile.bio.length} / {maxBioLength} characters
                                    </p>
                                </div>

                                <Button onClick={handleSave} className="w-full md:w-auto">
                                    Save Changes
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Plan and Stats */}
                    <div className="space-y-6">
                        {/* Current Plan */}
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-yellow-500" />
                                    Current Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                                    <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                                        {plan.status === "active" ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Billing cycle</span>
                                        <span className="font-medium">{plan.billingCycle}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Next billing</span>
                                        <span className="font-medium">{plan.nextBilling}</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full bg-transparent" onClick={onManageSubscription}>
                                    Manage Subscription
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Usage Statistics */}
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>Usage Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">Posts Created</span>
                                    </div>
                                    <span className="text-lg font-semibold">{usage.postsCreated.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="text-sm">Total Engagement</span>
                                    </div>
                                    <span className="text-lg font-semibold">{usage.totalEngagement}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">Days Active</span>
                                    </div>
                                    <span className="text-lg font-semibold">{usage.daysActive}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Connected Platforms */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Connected Platforms</CardTitle>
                        <CardDescription>Manage your social media connections</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {platforms.map((platform) => (
                            <div
                                key={platform.name}
                                className="flex items-center justify-between p-4 rounded-lg border border-border"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-muted">{platform.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{platform.name}</p>
                                        {platform.connected && <p className="text-xs text-muted-foreground">Connected</p>}
                                    </div>
                                </div>
                                {platform.connected ? (
                                    <Button variant="outline" size="sm" onClick={() => onDisconnect(platform.name)}>
                                        Disconnect
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => onConnect(platform.name)}>
                                        Connect
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}