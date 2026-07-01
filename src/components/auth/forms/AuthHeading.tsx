"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthHeadingProps {
    title: string;
    description: ReactNode;
    className?: string;
}

export function AuthHeading({
    title,
    description,
    className,
}: AuthHeadingProps) {
    return (
        <div className={cn("flex flex-col gap-3 text-center", className)}>
            <h2 className="text-[28px] font-bold leading-9 tracking-[-0.7px] text-[#F4F7F8] md:text-[32px] md:leading-[42px]">
                {title}
            </h2>
            <p className="text-[15px] leading-6 text-[#D5D8DA] md:text-base md:leading-7">
                {description}
            </p>
        </div>
    );
}
