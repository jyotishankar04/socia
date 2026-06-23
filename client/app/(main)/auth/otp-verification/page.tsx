"use client"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/errors"
import { useOtpVerification, useSelfQuery } from "@/lib/query"
import { useAuthStore } from "@/store/auth"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { Mail } from "lucide-react"
import { toast } from "sonner"

interface OTPForm {
    otp: string
}

const OTPVerification = () => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<OTPForm>()
    const [otpValue, setOtpValue] = useState("")
    const [cooldown, setCooldown] = useState(0)
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const purposeRef = searchParams.get("purpose")
    const router = useRouter()
    const { setUser } = useAuthStore()

    const { mutateAsync: verifyOtp, isPending: isVerifying, isSuccess: isVerifySuccess, data: verifyData } = useOtpVerification()
    const { data: user, refetch, isSuccess: isSelfSuccess } = useSelfQuery()

    const watchedOtp = watch("otp")

    useEffect(() => {
        register("otp", {
            required: "Verification code is required",
            minLength: { value: 6, message: "Verification code must be 6 digits" },
            maxLength: { value: 6, message: "Verification code must be 6 digits" },
            pattern: { value: /^[0-9]{6}$/, message: "Verification code must contain only numbers" }
        })
    }, [register])

    const handleOtpChange = (value: string) => {
        setOtpValue(value)
        setValue("otp", value, { shouldValidate: true })
    }

    useEffect(() => {
        if (isVerifySuccess && verifyData) {
            refetch()
        }
    }, [isVerifySuccess, verifyData, refetch])

    useEffect(() => {
        if (isSelfSuccess && user) {
            setUser(user.data)
            if (purposeRef === "register") {
                router.push("/auth/onboard")
            } else {
                router.push("/app")
            }
        }
    }, [isSelfSuccess, user, setUser, router, purposeRef])

    const onSubmit = async (data: OTPForm) => {
        if (!userId) return
        try {
            await verifyOtp({ userId: userId as string, otp: data.otp })
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not verify OTP"))
        }
    }

    const handleResendOtp = useCallback(() => {
        if (!userId) return
        setCooldown(30)
        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, [userId])

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    We&apos;ve sent a 6-digit verification code to your email address.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="w-full space-y-5">
                    <Field>
                        <FieldLabel htmlFor="otp" className="text-center block">Verification Code</FieldLabel>
                        <div className="flex justify-center w-full">
                            <InputOTP
                                maxLength={6}
                                value={otpValue}
                                onChange={handleOtpChange}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        {errors.otp && (
                            <p className="text-sm text-destructive mt-2 text-center">{errors.otp.message}</p>
                        )}
                    </Field>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isVerifying || watchedOtp?.length !== 6}
                    >
                        {isVerifying && <Spinner className="mr-2 h-4 w-4" />}
                        {isVerifying ? "Verifying…" : "Verify"}
                    </Button>
                </FieldGroup>
            </form>

            <div className="mt-5 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                    Didn&apos;t receive the code?{" "}
                    {cooldown > 0 ? (
                        <span className="text-muted-foreground">Resend in {cooldown}s</span>
                    ) : (
                        <button
                            type="button"
                            className="underline text-foreground hover:text-primary transition-colors"
                            onClick={handleResendOtp}
                        >
                            Resend
                        </button>
                    )}
                </p>
                <p className="text-xs text-muted-foreground">
                    Return to{" "}
                    <Link href="/auth/signin" className="underline text-foreground hover:text-primary transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default OTPVerification
