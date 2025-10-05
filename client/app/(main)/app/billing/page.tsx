"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
    CreditCard,
    Download,
    FileText,
    CheckCircle2,
    Crown,
    Sparkles,
    Zap,
    ArrowRight,
    Calendar,
    Receipt
} from "lucide-react"
import { useState } from "react"

export default function BillingPage() {
    const [billingInfo, setBillingInfo] = useState({
        currentPlan: "pro",
        autoRenew: true,
        paymentMethod: "visa"
    })

    const plans = [
        {
            id: "free",
            name: "Free",
            price: "$0",
            period: "forever",
            description: "Basic features for getting started",
            features: [
                "Up to 3 social accounts",
                "10 scheduled posts per month",
                "Basic analytics",
                "Standard support"
            ],
            cta: "Current Plan",
            current: true,
            popular: false
        },
        {
            id: "pro",
            name: "Professional",
            price: "$29",
            period: "per month",
            description: "Perfect for content creators",
            features: [
                "Up to 10 social accounts",
                "Unlimited scheduled posts",
                "Advanced analytics",
                "AI content suggestions",
                "Priority support",
                "Custom branding"
            ],
            cta: "Current Plan",
            current: true,
            popular: true
        },
        {
            id: "business",
            name: "Business",
            price: "$79",
            period: "per month",
            description: "For growing businesses",
            features: [
                "Up to 25 social accounts",
                "Unlimited scheduled posts",
                "Advanced analytics + ROI tracking",
                "AI content suggestions",
                "24/7 priority support",
                "Custom branding",
                "Team collaboration",
                "API access"
            ],
            cta: "Upgrade",
            current: false,
            popular: false
        }
    ]

    const billingHistory = [
        {
            id: "inv_001",
            date: "Jan 15, 2024",
            amount: "$29.00",
            status: "paid",
            description: "Professional Plan - Monthly"
        },
        {
            id: "inv_002",
            date: "Dec 15, 2023",
            amount: "$29.00",
            status: "paid",
            description: "Professional Plan - Monthly"
        },
        {
            id: "inv_003",
            date: "Nov 15, 2023",
            amount: "$29.00",
            status: "paid",
            description: "Professional Plan - Monthly"
        },
        {
            id: "inv_004",
            date: "Oct 15, 2023",
            amount: "$29.00",
            status: "paid",
            description: "Professional Plan - Monthly"
        }
    ]

    const paymentMethods = [
        {
            id: "visa",
            type: "Visa",
            last4: "4242",
            expiry: "12/25",
            isDefault: true
        },
        {
            id: "mastercard",
            type: "Mastercard",
            last4: "8888",
            expiry: "09/24",
            isDefault: false
        }
    ]

    const handlePlanChange = (planId: string) => {
        console.log("Changing plan to:", planId)
        setBillingInfo(prev => ({ ...prev, currentPlan: planId }))
        alert(`Plan changed to ${planId}`)
    }

    const handleDownloadInvoice = (invoiceId: string) => {
        console.log("Downloading invoice:", invoiceId)
        alert(`Downloading invoice ${invoiceId}`)
    }

    const handleUpdatePaymentMethod = () => {
        alert("Redirecting to payment method update...")
    }

    const handleCancelSubscription = () => {
        if (confirm("Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.")) {
            alert("Subscription cancelled successfully")
        }
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Billing</h1>
                    <p className="text-muted-foreground">Manage your subscription and payment methods</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Current Plan & Billing History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Plan */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-yellow-500" />
                                    Current Plan
                                </CardTitle>
                                <CardDescription>
                                    You're currently on the <strong>Professional</strong> plan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold">$29.00 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                        <p className="text-sm text-muted-foreground">Next billing date: February 15, 2024</p>
                                    </div>
                                    <Badge variant="default" className="bg-green-500">
                                        Active
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div>
                                        <p className="font-medium">Auto-renewal</p>
                                        <p className="text-sm text-muted-foreground">Your plan will automatically renew</p>
                                    </div>
                                    <Switch
                                        checked={billingInfo.autoRenew}
                                        onCheckedChange={(checked) => setBillingInfo(prev => ({ ...prev, autoRenew: checked }))}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-3">
                                <Button variant="outline" onClick={handleCancelSubscription}>
                                    Cancel Subscription
                                </Button>
                                <Button onClick={handleUpdatePaymentMethod}>
                                    Update Payment Method
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Billing History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing History</CardTitle>
                                <CardDescription>View and download your past invoices</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {billingHistory.map((invoice) => (
                                        <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">{invoice.description}</p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {invoice.date}
                                                        <Badge variant="secondary" className="text-xs">
                                                            {invoice.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold">{invoice.amount}</p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownloadInvoice(invoice.id)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Payment Methods & Upgrade Options */}
                    <div className="space-y-6">
                        {/* Payment Methods */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Payment Methods
                                </CardTitle>
                                <CardDescription>Manage your payment methods</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`flex items-center justify-between p-3 border rounded-lg ${method.isDefault ? "border-primary" : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                                                <CreditCard className="h-3 w-3" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{method.type} •••• {method.last4}</p>
                                                <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                                            </div>
                                        </div>
                                        {method.isDefault && (
                                            <Badge variant="secondary">Default</Badge>
                                        )}
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full" onClick={handleUpdatePaymentMethod}>
                                    Add Payment Method
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Upgrade Card */}
                        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-600" />
                                    Ready to upgrade?
                                </CardTitle>
                                <CardDescription>
                                    Get access to advanced features and higher limits
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-sm">Up to 25 social accounts</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-sm">Team collaboration tools</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-sm">Advanced ROI tracking</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                    Upgrade to Business
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Plans Comparison */}
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>Choose the right plan for you</CardTitle>
                        <CardDescription>
                            Scale your social media management with our flexible plans
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((plan) => (
                                <Card
                                    key={plan.id}
                                    className={`relative ${plan.current ? "border-primary ring-2 ring-primary/20" : ""
                                        } ${plan.popular ? "border-purple-200 dark:border-purple-800" : ""}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <Badge className="bg-purple-600">
                                                <Zap className="h-3 w-3 mr-1" />
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            {plan.name}
                                            {plan.current && (
                                                <Badge variant="secondary">Current</Badge>
                                            )}
                                        </CardTitle>
                                        <div className="text-3xl font-bold">
                                            {plan.price}
                                            <span className="text-sm font-normal text-muted-foreground">
                                                {plan.period !== "forever" && `/${plan.period}`}
                                            </span>
                                        </div>
                                        <CardDescription>{plan.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter>
                                        <Button
                                            className="w-full"
                                            variant={plan.current ? "outline" : "default"}
                                            onClick={() => handlePlanChange(plan.id)}
                                            disabled={plan.current}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Usage Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usage Summary</CardTitle>
                        <CardDescription>Your current plan usage for this billing period</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Social Accounts</span>
                                    <span className="font-medium">7/10</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: '70%' }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Scheduled Posts</span>
                                    <span className="font-medium">245/∞</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: '45%' }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">AI Content Usage</span>
                                    <span className="font-medium">89/100</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-purple-600 h-2 rounded-full"
                                        style={{ width: '89%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}