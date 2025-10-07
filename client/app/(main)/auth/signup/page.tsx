"use client"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useSelfQuery, useSignUpMutation } from "@/lib/query"
import { useAuthStore } from "@/store/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface SignUpForm {
    name: string
    email: string
    password: string
}

const Page = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpForm>();
    const router = useRouter();
    const { mutateAsync, data, isPending, isSuccess } = useSignUpMutation();
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message)
            router.replace(data.data.redirectEndpoint)
        }
    }, [isSuccess, router])

    const onSubmit = async (data: SignUpForm) => {
        await mutateAsync(data)
    }

    return (
        <div className="max-w-md p-4 pt-0 w-full flex flex-col items-center">
        <p className="text-sm text-foreground">
                Already have an account?{" "}
                <Link href="/auth/signin" className="underline">Login</Link>
            </p>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="w-full">
                    <Field>
                        <FieldLabel htmlFor="name-signup">
                            Name
                        </FieldLabel>
                        <Input
                            type="text"
                            id="name-signup"
                            placeholder="John Doe"
                            {...register("name", {
                                required: "Name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters"
                                }
                            })}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email-signup">
                            Email
                        </FieldLabel>
                        <Input
                            type="email"
                            id="email-signup"
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
                        <FieldLabel htmlFor="password-signup">
                            Password
                        </FieldLabel>
                        <Input
                            id="password-signup"
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
                        {isPending ? "Creating account..." : "Create account"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default Page