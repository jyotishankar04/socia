"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface ResetPasswordForm {
    newPassword: string
    confirmPassword: string
}

const ResetPasswordPage = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>()
    const [success, setSuccess] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const onSubmit = async (data: ResetPasswordForm) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error("Passwords do not match.")
            return
        }
        setSuccess(true)
        toast.success("Password reset successfully. You can now sign in.")
    }

    if (success) {
        return (
            <div className="w-full text-center space-y-5 py-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Password reset!</h2>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        Your password has been successfully reset.
                    </p>
                </div>
                <Link href="/auth/signin">
                    <Button className="gap-1.5">
                        Sign in with new password
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Reset your password</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Enter your new password below.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="w-full space-y-4">
                    <Field>
                        <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                id="new-password"
                                placeholder="Enter new password"
                                className="pr-10"
                                {...register("newPassword", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="confirm-password">Confirm New Password</FieldLabel>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                placeholder="Confirm new password"
                                className="pr-10"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (val) => val === watch("newPassword") || "Passwords do not match"
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </Field>

                    <Button className="w-full" type="submit">
                        Reset Password
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

export default ResetPasswordPage
