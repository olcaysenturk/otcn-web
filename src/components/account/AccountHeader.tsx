import React from "react";

interface AccountHeaderProps {
    title: string;
    description: string;
}

export function AccountHeader({ title, description }: AccountHeaderProps) {
    return (
        <div className="hidden lg:block space-y-1">
            <h1 className="text-2xl font-medium text-white">{title}</h1>
            <p className="text-sm text-gray-400">
                {description}
            </p>
        </div>
    );
}
