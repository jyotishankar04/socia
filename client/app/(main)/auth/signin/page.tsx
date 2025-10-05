import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const Page = () => {
    return (
        <div className="max-w-md p-4 pt-0 w-full flex flex-col items-center">
            <p className="text-sm text-primary-foreground">Don't have an account? <Link href="/auth/signup" className="underline">Sign up</Link></p>

            <form className="w-full ">
                <FieldGroup className="w-full">
                    <Field>
                        <FieldLabel htmlFor="email-signin">
                            Email
                        </FieldLabel>
                        <Input
                            type="email"
                            id="email-signin"
                            placeholder="jhon@example.com"
                            required
                        />
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
                            required
                            type="password"
                        />
                    </Field>
                    <Button className="w-full">Sign in</Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default Page
