import * as React from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UploaderProps {
  label?: string
  description?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  onFileSelect?: (files: FileList) => void
  className?: string
}

const Uploader = React.forwardRef<HTMLDivElement, UploaderProps>(
  ({ label = 'Click to upload', description, accept, multiple = false, disabled = false, onFileSelect, className }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = React.useState(false)

    const handleFiles = (files: FileList | null) => {
      if (files && files.length > 0) onFileSelect?.(files)
    }

    const onDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) setIsDragging(true)
    }
    const onDragLeave = () => setIsDragging(false)
    const onDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (!disabled) handleFiles(e.dataTransfer.files)
    }

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload area"
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !disabled && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-md',
          'border border-dashed border-border',
          'p-8 cursor-pointer transition-colors',
          'focus-visible:outline-none focus-visible:shadow-focus-default',
          isDragging && 'bg-accent border-foreground',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'hover:bg-accent/50',
          className,
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <Upload className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          tabIndex={-1}
        />
      </div>
    )
  },
)
Uploader.displayName = 'Uploader'

export { Uploader }
export default Uploader
