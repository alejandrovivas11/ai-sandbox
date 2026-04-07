import * as React from 'react'
import { Paperclip, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

export interface TextEditorProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onAttach?: () => void
  onMic?: () => void
  className?: string
}

function TextEditor({
  value,
  defaultValue,
  placeholder = 'Type a message…',
  disabled = false,
  onChange,
  onSubmit,
  onAttach,
  onMic,
  className,
}: TextEditorProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')
  const isControlled = value !== undefined
  const text = isControlled ? value : internalValue

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!isControlled) setInternalValue(e.target.value)
    onChange?.(e.target.value)
  }

  function handleSubmit() {
    onSubmit?.(text ?? '')
    if (!isControlled) setInternalValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-border bg-background p-3 transition-colors',
        'focus-within:ring-1 focus-within:ring-ring',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <Textarea
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={3}
        className="resize-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:shadow-none"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            onClick={onAttach}
            aria-label="Attach file"
            className="text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            onClick={onMic}
            aria-label="Voice input"
            className="text-muted-foreground hover:text-foreground"
          >
            <Mic className="size-4" />
          </Button>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={disabled || !text?.trim()}
          onClick={handleSubmit}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export { TextEditor }
export default TextEditor
