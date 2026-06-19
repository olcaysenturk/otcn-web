"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthLabelProps = {
    htmlFor: string;
    children: ReactNode;
    className?: string;
};

export function AuthLabel({ htmlFor, children, className }: AuthLabelProps) {
    return (
        <label
            htmlFor={htmlFor}
            className={cn(
                "mb-2 block text-[13px] font-medium leading-4 text-[#C5C9CC] md:text-[15px] md:leading-5",
                className
            )}
        >
            {children}
        </label>
    );
}
