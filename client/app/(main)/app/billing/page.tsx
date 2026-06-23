"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/custom/shared/page-header"
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
    Shield,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { motion } from "motion/react"

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
            current: billingInfo.currentPlan === "free",
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
            cta: billingInfo.currentPlan === "pro" ? "Current Plan" : "Upgrade",
            current: billingInfo.currentPlan === "pro",
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
            current: billingInfo.currentPlan === "business",
            popular: false
        }
    ]

    const billingHistory = [
        { id: "inv_001", date: "Jan 15, 2024", amount: "$29.00", status: "paid", description: "Professional Plan - Monthly" },
        { id: "inv_002", date: "Dec 15, 2023", amount: "$29.00", status: "paid", description: "Professional Plan - Monthly" },
        { id: "inv_003", date: "Nov 15, 2023", amount: "$29.00", status: "paid", description: "Professional Plan - Monthly" },
        { id: "inv_004", date: "Oct 15, 2023", amount: "$29.00", status: "paid", description: "Professional Plan - Monthly" },
    ]

    const paymentMethods = [
        { id: "visa", type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
        { id: "mastercard", type: "Mastercard", last4: "8888", expiry: "09/24", isDefault: false }
    ]

    const handlePlanChange = (planId: string) => {
        setBillingInfo(prev => ({ ...prev, currentPlan: planId }))
        toast.success(`Plan changed to ${planId}.`)
    }

    const handleDownloadInvoice = (invoiceId: string) => {
        toast.info(`Downloading invoice ${invoiceId}…`)
    }

    const handleUpdatePaymentMethod = () => {
        toast.info("Redirecting to payment method update…")
    }

    const handleCancelSubscription = () => {
        toast.error("Subscription cancelled. You'll retain access until the end of your billing period.", {
            action: { label: "Undo", onClick: () => toast.success("Cancellation reversed.") }
        })
    }

    const usageItems = [
        { label: "Social Accounts", value: 7, max: 10, percent: 70 },
        { label: "AI Content Usage", value: 89, max: 100, percent: 89 },
    ]

    return (
        <div className="p-6 space-y-6 max-w-5xl w-full mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <PageHeader
                    title="Billing"
                    description="Manage your subscription and payment methods"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
            >
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Crown className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Current Plan</p>
                                    <p className="text-xl font-bold text-foreground">
                                        Professional{" "}
                                        <span className="text-base font-normal text-muted-foreground">· $29.00/month</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Next billing: February 15, 2024</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                                    <Shield className="w-3 h-3" />
                                    Active
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-6"
            >
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-foreground">Choose the right plan</h2>
                    <p className="text-sm text-muted-foreground mt-1">Scale your social media management with our flexible plans</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative ${plan.current ? "border-primary ring-1 ring-primary/20" : ""} ${plan.popular ? "border-primary/40" : ""}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge className="gap-1 shadow-sm">
                                        <Zap className="h-3 w-3" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            <CardHeader className={plan.popular ? "pt-7" : ""}>
                                <CardTitle className="flex items-center justify-between text-base">
                                    {plan.name}
                                    {plan.current && <Badge variant="secondary">Current</Badge>}
                                </CardTitle>
                                <div className="text-3xl font-bold">
                                    {plan.price}
                                    {plan.period !== "forever" && (
                                        <span className="text-sm font-normal text-muted-foreground"> /{plan.period.replace("per ", "")}</span>
                                    )}
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={plan.current ? "outline" : "default"}
                                    onClick={() => !plan.current && handlePlanChange(plan.id)}
                                    disabled={plan.current}
                                >
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {usageItems.map((item) => (
                    <Card key={item.label}>
                        <CardContent className="p-5 space-y-2.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{item.label}</span>
                                <span className="font-medium">{item.value}/{item.max}</span>
                            </div>
                            <Progress value={item.percent} className="h-2" />
                        </CardContent>
                    </Card>
                ))}
                <Card>
                    <CardContent className="p-5 space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Scheduled Posts</span>
                            <span className="font-medium">245/∞</span>
                        </div>
                        <Progress value={45} className="h-2" />
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Payment Methods</CardTitle>
                        <CardDescription>Manage your payment methods</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                    method.isDefault ? "border-primary bg-primary/5" : "border-border"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                                        <CreditCard className="h-3 w-3" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{method.type} •••• {method.last4}</p>
                                        <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                                    </div>
                                </div>
                                {method.isDefault && (
                                    <Badge variant="secondary" className="text-xs">Default</Badge>
                                )}
                            </div>
                        ))}
                        <Button variant="outline" className="w-full mt-2" onClick={handleUpdatePaymentMethod}>
                            Add Payment Method
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Billing History</CardTitle>
                        <CardDescription>View and download your past invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {billingHistory.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileText className="h-7 w-7 text-muted-foreground shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{invoice.description}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                <Calendar className="h-3 w-3" />
                                                {invoice.date}
                                                <Badge variant="secondary" className="text-xs capitalize">
                                                    {invoice.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <p className="text-sm font-semibold">{invoice.amount}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
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
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
            >
                <Card>
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                <Switch
                                    checked={billingInfo.autoRenew}
                                    onCheckedChange={(checked) => setBillingInfo(prev => ({ ...prev, autoRenew: checked }))}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Auto-renewal</p>
                                <p className="text-xs text-muted-foreground">Your plan will automatically renew</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" onClick={handleCancelSubscription}>
                                Cancel Subscription
                            </Button>
                            <Button size="sm" onClick={handleUpdatePaymentMethod}>
                                Update Payment
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
