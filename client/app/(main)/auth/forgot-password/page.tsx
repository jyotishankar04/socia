"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const ForgotPasswordPage = () => {
    const [sent, setSent] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSent(true)
        toast.success("If that email is registered, you will receive a reset link shortly.")
    }

    if (sent) {
        return (
            <div className="w-full text-center space-y-5 py-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        We&apos;ve sent a password reset link to your email address.
                    </p>
                </div>
                <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Forgot your password?</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <FieldGroup className="w-full space-y-4">
                    <Field>
                        <FieldLabel htmlFor="email-forgot-password">Email Address</FieldLabel>
                        <Input
                            type="email"
                            id="email-forgot-password"
                            placeholder="john@example.com"
                            required
                        />
                    </Field>

                    <Button className="w-full" type="submit">
                        Send Reset Link
                    </Button>
                </FieldGroup>
            </form>

            <div className="mt-5 text-center">
                <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to sign in
                </Link>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
