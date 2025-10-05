import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const ResetPasswordPage = () => {
    return (
        <div className="max-w-md p-4 pt-0 w-full flex flex-col items-center">
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                    Enter your new password below.
                </p>
            </div>

            <form className="w-full">
                <FieldGroup className="w-full space-y-4">
                    <Field>
                        <FieldLabel htmlFor="new-password">
                            New Password
                        </FieldLabel>
                        <Input
                            type="password"
                            id="new-password"
                            placeholder="Enter new password"
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="confirm-password">
                            Confirm New Password
                        </FieldLabel>
                        <Input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm new password"
                            required
                        />
                    </Field>

                    <Button className="w-full" type="submit">
                        Reset Password
                    </Button>
                </FieldGroup>
            </form>

            <p className="text-sm text-primary-foreground mt-6">
                <Link href="/auth/signin" className="underline">Back to Login</Link>
            </p>
        </div>
    )
}

export default ResetPasswordPage