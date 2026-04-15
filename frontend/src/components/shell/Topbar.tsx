'use client'

import { Search, Bell } from 'lucide-react'
import Image from 'next/image'

/**
 * Topbar — matches Figma header exactly.
 * Reference: asana-ai-system/frontend/src/app/aba-test/all-targets/layout.tsx
 */
export function Topbar() {
  return (
    <header className="flex items-center justify-between pr-[24px] pl-[24px] h-[64px] shrink-0 bg-[#171717]">
      {/* Left: 3Y cube logo */}
      <div className="flex items-center">
        <Image src="/icons/logo-3y.svg" width={32} height={36} alt="3Y Health" />
      </div>

      {/* Right: action buttons + user profile */}
      <div className="flex flex-row items-center gap-[8px]">
        <button className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700">
          <Search className="w-[18px] h-[18px]" />
        </button>
        <button className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700">
          <Bell className="w-[18px] h-[18px]" />
        </button>
        <button className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700">
          <Image src="/icons/3y-ai-filled-stroke.svg" width={16} height={16} alt="3Y AI status" />
        </button>
        <div className="flex flex-row items-center gap-[8px] ml-[4px]">
          <div className="w-[32px] h-[32px] rounded-lg overflow-hidden">
            <Image src="/assets/avatar.png" width={32} height={32} alt="Sarah Johnson" className="rounded-lg" />
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[14px] font-[600] font-['Geist',sans-serif] text-[#F5F5F5]">Sarah Johnson</span>
            <span className="text-[12px] font-[400] font-['Geist',sans-serif] text-[#F5F5F5]">PsychCare Associates</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
