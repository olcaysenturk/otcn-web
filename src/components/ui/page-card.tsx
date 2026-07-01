import { cn } from "@/lib/utils";
import React from "react";

interface PageCardProps {
    children: React.ReactNode;
    className?: string;
}

export function PageCard({ children, className }: PageCardProps) {
    return (
        <div
            className={cn(
                "w-full -mt-3 lg:mt-0 space-y-0 lg:space-y-8 animate-in fade-in duration-500 rounded-none lg:rounded-4xl md:lg:rounded-44 border-none bg-transparent p-0 lg:p-6",
                className
            )}
        >
            {children}
        </div>
    );
}
