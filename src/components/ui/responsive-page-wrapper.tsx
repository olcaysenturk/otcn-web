import { cn } from "@/lib/utils";
import React from "react";

interface ResponsivePageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export function ResponsivePageWrapper({
    children,
    className,
}: ResponsivePageWrapperProps) {
    return (
        <div
            className={cn(
                // Mobile/Tablet: specific negative margins to counter main padding, full width background
                "-mx-2 lg:-mb-3 md:-mx-4 w-[calc(100%+16px)] md:w-[calc(100%+32px)] min-h-screen bg-[#0F1415] p-1.5 pb-0 lg:static lg:w-full lg:mx-0 lg:bg-transparent lg:min-h-0 lg:space-y-6",
                className
            )}
        >
            {children}
        </div>
    );
}
