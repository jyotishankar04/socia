"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/errors"
import { useSignUpMutation } from "@/lib/query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"

interface SignUpForm {
    name: string
    email: string
    password: string
}

const Page = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>()
    const router = useRouter()
    const { mutateAsync, data, isPending, isSuccess } = useSignUpMutation()
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (isSuccess && data) {
            toast.success(data.message)
            router.replace(data.data.redirectEndpoint)
        }
    }, [data, isSuccess, router])

    const onSubmit = async (data: SignUpForm) => {
        try {
            await mutateAsync(data)
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not create account"))
        }
    }

    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Create your account</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="underline underline-offset-4 text-foreground hover:text-primary">
                        Sign in
                    </Link>
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="w-full space-y-4">
                    <Field>
                        <FieldLabel htmlFor="name-signup">Full Name</FieldLabel>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                id="name-signup"
                                placeholder="John Doe"
                                className="pl-10"
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: { value: 2, message: "Name must be at least 2 characters" }
                                })}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email-signup">Email</FieldLabel>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="email"
                                id="email-signup"
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
                        <FieldLabel htmlFor="password-signup">Password</FieldLabel>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="password-signup"
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
                        {isPending ? "Creating account…" : "Create account"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default Page
