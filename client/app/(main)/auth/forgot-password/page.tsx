import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const ForgotPasswordPage = () => {
    return (
        <div className="max-w-md p-4 pt-0 w-full flex flex-col items-center">
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <p className="text-sm text-primary-foreground mb-6">
                Remember your password? <Link href="/auth/signin" className="underline">Back to Login</Link>
            </p>

            <form className="w-full">
                <FieldGroup className="w-full space-y-4">
                    <Field>
                        <FieldLabel htmlFor="email-forgot-password">
                            Email Address
                        </FieldLabel>
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

            {/* Additional helpful links */}
            <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button className="underline text-primary-foreground">try again</button>
                </p>
            </div>
        </div>
    )
}

export default ForgotPasswordPage