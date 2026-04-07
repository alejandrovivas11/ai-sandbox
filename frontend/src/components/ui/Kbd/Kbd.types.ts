import * as React from 'react'

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual background variant.
   * - `default`  — muted/neutral background (bg-muted, text-muted-foreground)
   * - `primary`  — semi-transparent white overlay, white text (for dark surfaces)
   */
  background?: 'default' | 'primary'
  /** Optional 12×12 icon rendered to the left of the text label */
  leftIcon?: React.ReactNode
  /** Optional 12×12 icon rendered to the right of the text label */
  rightIcon?: React.ReactNode
}

export interface KbdGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Rendering type for the group.
   * - `default`      — Kbds rendered side-by-side with a 4px gap (e.g. ⌘ ⇧ ⌥ ⌃)
   * - `+ separated`  — Kbds separated by a "+" text label (e.g. Ctrl + Alt + Shift + B)
   */
  type?: 'default' | '+ separated'
  /** Key labels rendered as individual Kbd elements */
  keys?: string[]
  /** Background variant forwarded to every child Kbd */
  background?: KbdProps['background']
}
