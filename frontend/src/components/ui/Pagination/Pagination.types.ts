import * as React from 'react'

export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {}
export interface PaginationContentProps extends React.ComponentPropsWithoutRef<'ul'> {}
export interface PaginationItemProps extends React.ComponentPropsWithoutRef<'li'> {}
export interface PaginationLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  isActive?: boolean
  href?: string
}
export interface PaginationPreviousProps extends React.ComponentPropsWithoutRef<'a'> {
  href?: string
}
export interface PaginationNextProps extends React.ComponentPropsWithoutRef<'a'> {
  href?: string
}
export interface PaginationEllipsisProps extends React.ComponentPropsWithoutRef<'span'> {}
