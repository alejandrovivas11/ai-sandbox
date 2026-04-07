import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
} from './Pagination.types'

const Pagination = ({ className, ...props }: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('flex justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  ),
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn(className)} {...props} />,
)
PaginationItem.displayName = 'PaginationItem'

const PaginationLink = ({ className, isActive, href, ...props }: PaginationLinkProps) => (
  <a
    href={href}
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium size-9 transition-colors hover:bg-accent hover:text-accent-foreground',
      isActive
        ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
        : 'bg-transparent',
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({ className, href, ...props }: PaginationPreviousProps) => (
  <Button
    asChild
    variant="ghost"
    className={cn('gap-1 pl-2.5 pr-4 h-9', className)}
  >
    <a href={href} aria-label="Go to previous page" {...props}>
      <ChevronLeft className="size-4" />
      <span>Previous</span>
    </a>
  </Button>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ className, href, ...props }: PaginationNextProps) => (
  <Button
    asChild
    variant="ghost"
    className={cn('gap-1 pl-4 pr-2.5 h-9', className)}
  >
    <a href={href} aria-label="Go to next page" {...props}>
      <span>Next</span>
      <ChevronRight className="size-4" />
    </a>
  </Button>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: PaginationEllipsisProps) => (
  <span
    aria-hidden="true"
    className={cn('flex size-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
export default Pagination
