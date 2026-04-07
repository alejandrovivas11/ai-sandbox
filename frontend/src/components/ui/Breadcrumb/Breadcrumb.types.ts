import * as React from 'react'

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {}
export interface BreadcrumbListProps extends React.ComponentPropsWithoutRef<'ol'> {}
export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<'li'> {}
export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  href?: string
}
export interface BreadcrumbPageProps extends React.ComponentPropsWithoutRef<'span'> {}
export interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<'li'> {}
export interface BreadcrumbEllipsisProps extends React.ComponentPropsWithoutRef<'span'> {}
