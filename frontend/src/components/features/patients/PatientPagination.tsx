"use client"

import { Button } from "@/components/ui/Button"
import { Muted } from "@/components/ui/Typography"

interface PatientPaginationProps {
  currentPage: number
  totalPages: number
  totalResults: number
  startIndex: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function PatientPagination({
  currentPage,
  totalPages,
  totalResults,
  startIndex,
  pageSize,
  onPageChange,
}: PatientPaginationProps) {
  const endIndex = Math.min(startIndex + pageSize, totalResults)

  function getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) {
        pages.push("...")
      }
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) {
        pages.push("...")
      }
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-row items-center justify-between px-6 py-4">
      <Muted className="text-sm">
        Showing {startIndex + 1}-{endIndex} of {totalResults} patients
      </Muted>
      <div className="flex flex-row items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        {getPageNumbers().map((page, idx) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${idx}`} className="text-sm text-gray-500 px-1">
              {page}
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
