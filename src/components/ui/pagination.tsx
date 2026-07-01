import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    // Logic to show limited page numbers with ellipsis can be added here if needed.
    // For now, a simple list is sufficient as per the initial requirement, 
    // but let's make it slightly smart to not show 100 pages if they exist.
    // Given the mockup showed 1, 2, 3, 4, 5 ... 10, let's try to mimic that simple range logic.

    const renderPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 7) {
            // Show all if small number of pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first, last, current, and neighbors
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pageNumbers.push(i);
                pageNumbers.push("...");
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pageNumbers.push(1);
                pageNumbers.push("...");
                for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
            } else {
                pageNumbers.push(1);
                pageNumbers.push("...");
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push("...");
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers.map((page, index) => {
            if (page === "...") {
                return (
                    <span key={`ellipsis-${index}`} className="text-body-xs text-gray-500">
                        ...
                    </span>
                );
            }

            const isCurrent = page === currentPage;
            return (
                <button
                    key={page}
                    onClick={() => onPageChange(page as number)}
                    className={`h-8 w-8 flex items-center justify-center rounded-full text-body-xs-medium transition-colors ${isCurrent
                            ? "bg-white text-[#0F1415]"
                            : "text-gray-400 hover:bg-white/10"
                        }`}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {renderPageNumbers()}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}
