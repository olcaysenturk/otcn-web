"use client";

import { cn } from "@/lib/utils";

interface AuthPromptProps {
    prompt: string;
    buttonText: string;
    onAction: () => void;
    disabled?: boolean;
    className?: string;
}

export function AuthPrompt({
    prompt,
    buttonText,
    onAction,
    disabled,
    className,
}: AuthPromptProps) {
    return (
        <p className={cn("mt-6 text-center text-sm leading-6 text-[#C5C9CC] md:text-[15px]", className)}>
            {prompt}{" "}
            <button
                type="button"
                onClick={onAction}
                className="ml-0.5 font-bold text-[#F4F7F8] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={disabled}
            >
                {buttonText}
            </button>
        </p>
    );
}
