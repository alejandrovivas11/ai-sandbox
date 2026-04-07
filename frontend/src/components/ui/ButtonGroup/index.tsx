import * as React from 'react'
import { cn } from '@/lib/utils'
import type {
  ButtonGroupProps,
  ButtonGroupContextValue,
  ButtonGroupOrientation,
  ButtonGroupVariant,
} from './ButtonGroup.types'

// ---------------------------------------------------------------------------
// Context — lets child <Button> components know they live inside a group
// ---------------------------------------------------------------------------

export const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(null)

export function useButtonGroup() {
  return React.useContext(ButtonGroupContext)
}

// ---------------------------------------------------------------------------
// Helpers — build the class string that overrides a child button's rounding
// ---------------------------------------------------------------------------

/**
 * Returns the Tailwind classes that should be added to a button at `index`
 * inside a group of `total` buttons, for the given orientation.
 *
 * Design rule (from Figma):
 *   - Buttons in a group share a continuous border; inner radii are removed
 *     so the buttons look flush against each other.
 *   - Horizontal: only the first button keeps left radii, only the last keeps
 *     right radii.  All others are fully square on the joined edges.
 *   - Vertical: same logic applied to top/bottom edges.
 *   - A 1 px separator is rendered between buttons instead of double borders.
 */
function getChildRoundingClasses(
  index: number,
  total: number,
  orientation: ButtonGroupOrientation,
): string {
  if (total === 1) return ''

  const isFirst = index === 0
  const isLast = index === total - 1

  if (orientation === 'horizontal') {
    if (isFirst) return 'rounded-r-none'
    if (isLast) return 'rounded-l-none'
    return 'rounded-none'
  }

  // vertical
  if (isFirst) return 'rounded-b-none'
  if (isLast) return 'rounded-t-none'
  return 'rounded-none'
}

// ---------------------------------------------------------------------------
// Separator — the thin 1 px divider rendered between buttons
// ---------------------------------------------------------------------------

interface SeparatorProps {
  orientation: ButtonGroupOrientation
  variant: ButtonGroupVariant
}

function ButtonGroupSeparator({ orientation, variant }: SeparatorProps) {
  const isOutline = variant === 'outline'

  return (
    <div
      aria-hidden="true"
      className={cn(
        'shrink-0',
        orientation === 'horizontal' ? 'self-stretch w-px' : 'w-full h-px',
        // For filled variants the separator is a subtle lighter line drawn on
        // top of the dark background.  For outline it collapses into the
        // shared border — we use the border colour so it looks like one line.
        isOutline ? 'bg-border' : 'bg-white/20',
      )}
    />
  )
}

// ---------------------------------------------------------------------------
// ButtonGroup
// ---------------------------------------------------------------------------

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'default',
      size = 'default',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Collect valid React element children so we can inject rounding overrides
    const childArray = React.Children.toArray(children).filter(React.isValidElement)
    const total = childArray.length

    const augmentedChildren = childArray.flatMap((child, index) => {
      // Clone the child and merge rounding overrides into its className
      const roundingClasses = getChildRoundingClasses(index, total, orientation)
      const cloned = React.cloneElement(child as React.ReactElement<{ className?: string }>, {
        className: cn(
          (child as React.ReactElement<{ className?: string }>).props.className,
          roundingClasses,
        ),
      })

      // Insert a separator between buttons (not after the last one)
      if (index < total - 1) {
        return [
          cloned,
          <ButtonGroupSeparator
            key={`sep-${index}`}
            orientation={orientation}
            variant={variant}
          />,
        ]
      }

      return [cloned]
    })

    return (
      <ButtonGroupContext.Provider value={{ orientation, variant, size }}>
        <div
          ref={ref}
          role="group"
          className={cn(
            'inline-flex items-stretch',
            // Shared shadow for the whole group
            variant === 'outline' ? 'shadow-xs' : '',
            // Outer border for outline variant wraps the whole group
            variant === 'outline'
              ? 'rounded-md border border-input overflow-hidden'
              : 'rounded-md overflow-hidden',
            orientation === 'vertical' && 'flex-col',
            className,
          )}
          {...props}
        >
          {augmentedChildren}
        </div>
      </ButtonGroupContext.Provider>
    )
  },
)

ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }
export default ButtonGroup
