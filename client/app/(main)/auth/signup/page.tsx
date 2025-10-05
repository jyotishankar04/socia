import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const Page = () => {
    return (
        <div className="max-w-md p-4 pt-0 w-full flex flex-col items-center">
            <p className="text-sm text-primary-foreground">Already have an account? <Link href="/auth/signin" className="underline">Login</Link></p>

            <form className="w-full ">
                <FieldGroup className="w-full">
                    <Field>
                        <FieldLabel htmlFor="name-signup">
                            Name
                        </FieldLabel>
                        <Input
                            type="text"
                            id="name-signup"
                            placeholder="John Doe"
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email-signup">
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
                        <FieldLabel htmlFor="password-signup">
                            Password
                        </FieldLabel>
                        <Input
                            id="password-signup"
                            placeholder="*********"
                            required
                            type="password"
                        />
                    </Field>
                    <Button className="w-full">Create account</Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default Page
