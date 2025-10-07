"use client"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { useOtpVerification, useSelfQuery } from "@/lib/query"
import { useAuthStore } from "@/store/auth"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

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
    } = useForm<OTPForm>();
    const [otpValue, setOtpValue] = useState("")
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const purposeRef = searchParams.get("purpose")
    const router = useRouter();
    const { setUser } = useAuthStore()

    const { mutateAsync: verifyOtp, isPending: isVerifying, isSuccess: isVerifySuccess, data: verifyData } = useOtpVerification();
    const { data: user, refetch, isRefetching, isSuccess: isSelfSuccess } = useSelfQuery();

    // Watch for OTP value changes
    const watchedOtp = watch("otp");

    // Set up OTP field registration
    useEffect(() => {
        register("otp", {
            required: "Verification code is required",
            minLength: {
                value: 6,
                message: "Verification code must be 6 digits"
            },
            maxLength: {
                value: 6,
                message: "Verification code must be 6 digits"
            },
            pattern: {
                value: /^[0-9]{6}$/,
                message: "Verification code must contain only numbers"
            }
        });
    }, [register]);

    // Handle OTP value changes
    const handleOtpChange = (value: string) => {
        setOtpValue(value);
        setValue("otp", value, { shouldValidate: true });
    };

    // Handle successful verification
    useEffect(() => {
        if (isVerifySuccess && verifyData) {
            refetch()
        }
    }, [isVerifySuccess, verifyData, setUser, router])

    useEffect(() => {
        if (isSelfSuccess && user) {
            setUser(user.data)
            if(purposeRef === "register") {
                router.push("/auth/onboard")
            }else{
                router.push("/app")
            }
        }
    }, [isSelfSuccess, user, setUser, router])


    const onSubmit = async (data: OTPForm) => {
        if (!userId) {
            console.error("User ID is missing");
            return;
        }

        await verifyOtp({
            userId: userId as string,
            otp: data.otp
        });
    }

    const handleResendOtp = async () => {
        if (!userId) {
            console.error("User ID is missing");
            return;
        }

    }

    return (
        <div className="max-w-md p-4 pt-0 w-full flex flex-col items-center">
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit verification code to your email address.
                </p>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="w-full space-y-4">
                    <Field>
                        <FieldLabel htmlFor="otp">Verification Code</FieldLabel>
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
                            <p className="text-sm text-red-500 mt-2 text-center">{errors.otp.message}</p>
                        )}
                    </Field>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isVerifying || watchedOtp?.length !== 6}
                    >
                        {isVerifying && <Spinner />}
                        {isVerifying ? "Verifying..." : "Verify"}
                    </Button>
                </FieldGroup>
            </form>

            {/* Additional helpful links */}
            <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        className="underline text-foreground hover:tex-foreground/80 disabled:opacity-50"
                        onClick={handleResendOtp}
                    >
                        Resend
                    </button>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Return to {" "}
                    <Link href="/auth/signin" className="underline text-foreground">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default OTPVerification