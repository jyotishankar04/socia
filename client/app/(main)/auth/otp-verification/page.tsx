"use client"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import Link from "next/link"
import { useState } from "react"

const OTPVerification = () => {    
    return (
        <div className="max-w-md p-4 pt-0 w-full flex flex-col items-center">
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit verification code to your email address.
                </p>
            </div>

            <form className="w-full">
                <FieldGroup className="w-full space-y-4">
                    <Field>
                        <FieldLabel htmlFor="otp">Verification Code</FieldLabel>
                        <div className="flex justify-center w-full">
                            <InputOTP
                                maxLength={6}
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
                    </Field>

                    <Button className="w-full" type="submit">
                        Verify
                    </Button>
                </FieldGroup>
            </form>

            {/* Additional helpful links */}
            <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button
                        className="underline text-primary-foreground hover:text-primary-foreground/80"
                       
                    >
                        Resend
                    </button>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Return to {" "}
                    <Link href="/auth/login" className="underline text-primary-foreground">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default OTPVerification