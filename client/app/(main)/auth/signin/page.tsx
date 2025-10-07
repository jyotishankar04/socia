"use client"
import LoadingModal from "@/components/custom/essenticals/loading-model"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useSelfQuery, useSignInMutation } from "@/lib/query"
import { useAuthStore } from "@/store/auth"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

interface SignInForm {
    email: string
    password: string
}

const Page = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignInForm>();

    const router = useRouter();
    const { setUser } = useAuthStore()
    const { data: user, refetch, isRefetching, isSuccess: isSelfSuccess } = useSelfQuery()
    const { mutateAsync, isPending, isSuccess } = useSignInMutation();

    useEffect(() => {
        if (isSuccess) {
            refetch()
        }
    }, [refetch, isSuccess])

    useEffect(() => {
        if (isSelfSuccess && user) {
            setUser(user)
            router.push("/app/")
        }
    }, [isSelfSuccess, user, setUser, router])

    const onSubmit = async (data: SignInForm) => {
        await mutateAsync(data)
    }

    return (
        <div className="max-w-md p-4 pt-0 w-full flex flex-col items-center">
            <p className="text-sm text-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="underline">Sign up</Link>
            </p>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="w-full">
                    <Field>
                        <FieldLabel htmlFor="email-signin">
                            Email
                        </FieldLabel>
                        <Input
                            type="email"
                            id="email-signin"
                            placeholder="jhon@example.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </Field>

                    <Field>
                        <div className="flex flex-row justify-between">
                            <FieldLabel htmlFor="password-signin">
                                Password
                            </FieldLabel>
                            <p className="text-sm text-muted-foreground">
                                <Link href="/auth/forgot-password" className="underline">Forgot password?</Link>
                            </p>
                        </div>
                        <Input
                            id="password-signin"
                            placeholder="*********"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </Field>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending && <Spinner />}
                        {isPending ? "Signing in..." : "Sign in"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default Page