"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Target, ChevronDown, ChevronRight, Diamond, Brain, MessageCircle } from "lucide-react"

const SKILL_AREAS = [
  {
    id: "caregiver-goals",
    label: "Caregiver Goals",
    icon: Diamond,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    items: [],
    defaultExpanded: false,
  },
  {
    id: "cognition",
    label: "Cognition",
    icon: Brain,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50",
    items: [],
    defaultExpanded: false,
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageCircle,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    items: [{ id: "mand", label: "Mand", checked: false }],
    defaultExpanded: true,
  },
]

export default function PatientDetailPage() {
  const [activeTab, setActiveTab] = useState<"skills" | "behaviors">("skills")
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {}
      SKILL_AREAS.forEach((area) => {
        initial[area.id] = area.defaultExpanded
      })
      return initial
    }
  )

  const toggleArea = (id: string) => {
    setExpandedAreas((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back button */}
      <div>
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 text-[14px] text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to patients
        </Link>
      </div>

      {/* Patient name header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold text-neutral-900">
          Samantha Green
        </h1>
      </div>

      {/* Tabs: Skills | Behaviors */}
      <div className="flex flex-row items-center gap-0 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("skills")}
          className={`px-[16px] py-[10px] text-[14px] font-medium border-b-2 transition-colors ${
            activeTab === "skills"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Skills
        </button>
        <button
          onClick={() => setActiveTab("behaviors")}
          className={`px-[16px] py-[10px] text-[14px] font-medium border-b-2 transition-colors ${
            activeTab === "behaviors"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Behaviors
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "skills" && (
        <div className="flex flex-col gap-6">
          {/* All targets header */}
          <div className="flex flex-row items-center gap-2">
            <Target className="w-[18px] h-[18px] text-neutral-600" />
            <span className="text-[14px] font-medium text-neutral-900">
              All targets
            </span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-[6px] text-[12px] font-medium text-gray-600 bg-gray-100 rounded-full">
              3
            </span>
          </div>

          {/* Skill Area label */}
          <div>
            <span className="inline-flex items-center px-[8px] py-[2px] text-[12px] font-medium text-gray-600 bg-gray-100 rounded-[6px]">
              Skill Area
            </span>
          </div>

          {/* Skill areas list */}
          <div className="flex flex-col gap-1">
            {SKILL_AREAS.map((area) => {
              const Icon = area.icon
              const isExpanded = expandedAreas[area.id]

              return (
                <div key={area.id} className="flex flex-col">
                  {/* Skill area header */}
                  <button
                    onClick={() => toggleArea(area.id)}
                    className="flex flex-row items-center gap-3 px-[12px] py-[10px] rounded-[8px] hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span
                      className={`inline-flex items-center justify-center w-[24px] h-[24px] rounded-[6px] ${area.iconBg}`}
                    >
                      <Icon className={`w-[14px] h-[14px] ${area.iconColor}`} />
                    </span>
                    <span className="text-[14px] font-medium text-neutral-900">
                      {area.label}
                    </span>
                  </button>

                  {/* Expanded items */}
                  {isExpanded && area.items.length > 0 && (
                    <div className="flex flex-col gap-0 pl-[52px]">
                      {area.items.map((item) => (
                        <label
                          key={item.id}
                          className="flex flex-row items-center gap-3 px-[12px] py-[8px] rounded-[6px] hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            defaultChecked={item.checked}
                            className="w-[16px] h-[16px] rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-[14px] text-neutral-700">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === "behaviors" && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-[14px]">
          No behaviors configured yet.
        </div>
      )}
    </div>
  )
}
