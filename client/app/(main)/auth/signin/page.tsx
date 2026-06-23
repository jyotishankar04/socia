"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/errors"
import { useSelfQuery, useSignInMutation } from "@/lib/query"
import { useAuthStore } from "@/store/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface SignInForm {
    email: string
    password: string
}

const Page = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>()
    const router = useRouter()
    const { setUser } = useAuthStore()
    const { data: user, refetch, isSuccess: isSelfSuccess } = useSelfQuery()
    const { mutateAsync, isPending, isSuccess } = useSignInMutation()
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (isSuccess) refetch()
    }, [refetch, isSuccess])

    useEffect(() => {
        if (isSelfSuccess && user) {
            setUser(user.data)
            router.push("/app")
        }
    }, [isSelfSuccess, user, setUser, router])

    const onSubmit = async (data: SignInForm) => {
        try {
            await mutateAsync(data)
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not sign in"))
        }
    }

    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="underline underline-offset-4 text-foreground hover:text-primary">
                        Sign up
                    </Link>
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="w-full space-y-4">
                    <Field>
                        <FieldLabel htmlFor="email-signin">Email</FieldLabel>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="email"
                                id="email-signin"
                                placeholder="john@example.com"
                                className="pl-10"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                        )}
                    </Field>

                    <Field>
                        <div className="flex flex-row justify-between items-center">
                            <FieldLabel htmlFor="password-signin">Password</FieldLabel>
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="password-signin"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                        )}
                    </Field>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Spinner className="mr-2 h-4 w-4" />}
                        {isPending ? "Signing in…" : "Sign in"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default Page
