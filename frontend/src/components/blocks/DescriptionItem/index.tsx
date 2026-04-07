import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/Separator'

export interface DescriptionItemProps {
  label: string
  value?: string
  type?: 'text' | 'input' | 'textarea'
  direction?: 'horizontal' | 'vertical'
  editable?: boolean
  onEdit?: () => void
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
}

const DescriptionItem = React.forwardRef<HTMLDivElement, DescriptionItemProps>(
  (
    {
      label,
      value = '',
      type = 'text',
      direction = 'horizontal',
      editable = false,
      onEdit,
      placeholder,
      onChange,
      className,
    },
    ref,
  ) => {
    const labelId = React.useId()

    return (
      <div ref={ref} className={cn('flex flex-col gap-0', className)}>
        <div
          className={cn(
            'flex gap-3 py-3',
            direction === 'horizontal'
              ? 'flex-row items-center justify-between'
              : 'flex-col items-start',
          )}
        >
          <Label
            htmlFor={type !== 'text' ? labelId : undefined}
            className="text-sm font-medium text-foreground shrink-0 min-w-[140px]"
          >
            {label}
          </Label>

          <div className="flex flex-1 items-center gap-2 w-full">
            {type === 'text' && (
              <span className="flex-1 text-sm text-muted-foreground truncate">
                {value || <span className="text-muted-foreground/50 italic">{placeholder ?? '—'}</span>}
              </span>
            )}

            {type === 'input' && (
              <Input
                id={labelId}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                className="flex-1 h-8 text-sm"
              />
            )}

            {type === 'textarea' && (
              <Textarea
                id={labelId}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                className="flex-1 min-h-[72px] text-sm resize-none"
              />
            )}

            {editable && type === 'text' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
        <Separator />
      </div>
    )
  },
)
DescriptionItem.displayName = 'DescriptionItem'

export { DescriptionItem }
export default DescriptionItem
