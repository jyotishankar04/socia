import { Spinner } from "@/components/ui/spinner"

interface LoadingModalProps {
    text: string
    description: string
    size?: "sm" | "md" | "lg"
    centered?: boolean
}

const LoadingModal: React.FC<LoadingModalProps> = ({
    text,
    description,
    size = "md",
    centered = true
}) => {
    const sizeClasses = {
        sm: "max-w-xs",
        md: "max-w-sm",
        lg: "max-w-md"
    }

    const spinnerSizes = {
        sm: "size-6",
        md: "size-8",
        lg: "size-10"
    }

    const textSizes = {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl"
    }

    return (
        <div className={`${centered ? "fixed inset-0 z-100 flex items-center justify-center" : "w-full"}`}>
            {/* Backdrop - only for centered modal */}
            {centered && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            )}

            {/* Modal Content */}
            <div
                className={`
                    relative z-10
                    ${sizeClasses[size]}
                    animate-in fade-in-0 zoom-in-95 duration-200
                    border border-border bg-card text-card-foreground
                    rounded-lg shadow-lg
                    w-full mx-4
                `}
            >
                <div className="flex flex-col items-center gap-6 p-6">
                    {/* Animated Spinner */}
                    <div className="flex justify-center">
                        <Spinner
                            className={`
                                ${spinnerSizes[size]} 
                                text-primary 
                                animate-spin
                            `}
                        />
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <h1 className={`
                            ${textSizes[size]}
                            font-semibold text-foreground
                            animate-pulse
                        `}>
                            {text}
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingModal