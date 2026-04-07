'use client'

import * as React from 'react'
import { OTPInput } from 'input-otp'

export type InputOTPProps = React.ComponentPropsWithoutRef<typeof OTPInput>
export type InputOTPGroupProps = React.HTMLAttributes<HTMLDivElement>
export type InputOTPSlotProps = React.HTMLAttributes<HTMLDivElement> & { index: number }
export type InputOTPSeparatorProps = React.HTMLAttributes<HTMLDivElement>
