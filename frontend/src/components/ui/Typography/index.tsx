import * as React from 'react'
import { cn } from '@/lib/utils'
import type {
  H1Props,
  H2Props,
  H3Props,
  H4Props,
  PProps,
  LeadProps,
  LargeProps,
  SmallProps,
  MutedProps,
  BlockquoteProps,
  InlineCodeProps,
} from './Typography.types'

const H1 = React.forwardRef<HTMLHeadingElement, H1Props>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn('text-4xl font-semibold tracking-tight', className)}
    {...props}
  />
))
H1.displayName = 'H1'

const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-3xl font-semibold tracking-tight', className)}
    {...props}
  />
))
H2.displayName = 'H2'

const H3 = React.forwardRef<HTMLHeadingElement, H3Props>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold tracking-tight', className)}
    {...props}
  />
))
H3.displayName = 'H3'

const H4 = React.forwardRef<HTMLHeadingElement, H4Props>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn('text-xl font-semibold tracking-tight', className)}
    {...props}
  />
))
H4.displayName = 'H4'

const P = React.forwardRef<HTMLParagraphElement, PProps>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm font-normal leading-normal text-foreground', className)}
    {...props}
  />
))
P.displayName = 'P'

const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xl text-muted-foreground', className)}
    {...props}
  />
))
Lead.displayName = 'Lead'

const Large = React.forwardRef<HTMLDivElement, LargeProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
))
Large.displayName = 'Large'

const Small = React.forwardRef<HTMLElement, SmallProps>(({ className, ...props }, ref) => (
  <small
    ref={ref}
    className={cn('text-sm font-medium leading-none', className)}
    {...props}
  />
))
Small.displayName = 'Small'

const Muted = React.forwardRef<HTMLParagraphElement, MutedProps>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
Muted.displayName = 'Muted'

const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn('mt-6 border-l-2 border-border pl-6 italic', className)}
      {...props}
    />
  ),
)
Blockquote.displayName = 'Blockquote'

const InlineCode = React.forwardRef<HTMLElement, InlineCodeProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        'relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className,
      )}
      {...props}
    />
  ),
)
InlineCode.displayName = 'InlineCode'

export { H1, H2, H3, H4, P, Lead, Large, Small, Muted, Blockquote, InlineCode }
export default H1
