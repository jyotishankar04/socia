import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <div className="text-center space-y-4 max-w-sm">
                <p className="text-7xl font-bold text-primary/20">404</p>
                <h1 className="text-xl font-semibold text-foreground">Page not found</h1>
                <p className="text-sm text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link href="/">
                    <Button variant="outline" className="gap-2 mt-2">
                        <ArrowLeft className="w-4 h-4" />
                        Go home
                    </Button>
                </Link>
            </div>
        </div>
    )
}
