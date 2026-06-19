import { Inbox } from "lucide-react";

type EmptyStateProps = {
    title: string;
    description?: string;
    className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center py-12 text-center bg-white/5 min-h-[400px] w-full ${className}`}
        >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Inbox className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
        </div>
    );
}
