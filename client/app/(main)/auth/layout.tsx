"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconBrandGithub, IconBrandGoogleFilled } from '@tabler/icons-react';
import { usePathname } from "next/navigation";



const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname()
    const ignorePaths = [
        "/auth/reset-password",
        "/auth/forgot-password",
        "/auth/otp-verification",
        "/auth/onboard",
    ]
    return (
        <div className="flex flex-col items-center justify-center h-screen">

            <div className='flex flex-row items-end gap-1 mb-4'>
                <h1 className='text-4xl font-stretch-105%'><span className='font-bold underline text-primary'>Q</span>wikish</h1>
            </div>
            {children}
            {
                !ignorePaths.includes(pathname) ? <>
                    <Separator className="my-4 max-w-sm relative " orientation="horizontal" >
                        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-background px-4">
                            or
                        </span>
                    </Separator>
                    <div className="grid grid-cols-2 p-4 pt-0 max-w-md w-full  gap-2">
                        <Button variant={"outline"}>
                            <IconBrandGoogleFilled />
                            <span>Continue with Google</span>
                        </Button>
                        <Button variant={"outline"}>
                            <IconBrandGithub />
                            <span>Continue with Github</span>
                        </Button>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            By continuing, you agree to our{" "}
                            <span
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Terms of Service
                            </span>{" "}
                            and{" "}
                            <span
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Privacy Policy
                            </span>
                            .
                        </p>
                    </div>
                </> : null
            }

        </div>
    )
}

export default layout