"use client"

import * as React from "react"

interface SignatureFieldProps {
  label: string
  value?: string
  required?: boolean
  onChange?: (value: string) => void
}

export function SignatureField({
  label,
  value = "",
  required = false,
  onChange,
}: SignatureFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="border border-gray-200 rounded-md p-4 min-h-[80px] bg-gray-50 flex items-end">
        {value ? (
          <span className="text-lg italic text-gray-700 font-serif">
            {value}
          </span>
        ) : (
          <span className="text-sm text-gray-400">Sign here</span>
        )}
      </div>
    </div>
  )
}
