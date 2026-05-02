import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic for "..." 
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={cn("mt-20 flex justify-center items-center gap-2", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
          currentPage === 1 ? "text-bombay/50 cursor-not-allowed" : "text-elm hover:bg-slate-100"
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-2 text-bombay">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors font-medium",
                currentPage === page
                  ? "bg-codgray text-white font-bold ambient-shadow"
                  : "text-codgray hover:bg-slate-100"
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
          currentPage === totalPages ? "text-bombay/50 cursor-not-allowed" : "text-elm hover:bg-slate-100"
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
