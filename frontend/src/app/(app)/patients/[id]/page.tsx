"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ChevronDown, ChevronRight, Plus } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Checkbox } from "@/components/ui/Checkbox"
import {
  Card,
  CardContent,
} from "@/components/ui/Card"
import { usePatientChart } from "@/hooks/usePatientChart"

/* ── inline SVG icons ── */
const SpeechIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V12C18 13.1046 17.1046 14 16 14H6L2 18V4Z" fill="currentColor" />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 17.5L8.55 16.15C4.4 12.36 1.5 9.72 1.5 6.5C1.5 3.78 3.62 1.5 6.25 1.5C7.74 1.5 9.17 2.21 10 3.33C10.83 2.21 12.26 1.5 13.75 1.5C16.38 1.5 18.5 3.78 18.5 6.5C18.5 9.72 15.6 12.36 11.45 16.15L10 17.5Z" fill="currentColor" />
  </svg>
)

const DiamondIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 1L19 10L10 19L1 10L10 1Z" fill="currentColor" />
  </svg>
)

const BrainIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2C7.5 2 6 3.5 6 5.5C4.5 5.5 3 7 3 9C3 11 4.5 12.5 6 12.5V17H10V2Z" fill="currentColor" />
    <path d="M10 2C12.5 2 14 3.5 14 5.5C15.5 5.5 17 7 17 9C17 11 15.5 12.5 14 12.5V17H10V2Z" fill="currentColor" />
  </svg>
)

const HandIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 8V3.5C15 2.67 14.33 2 13.5 2S12 2.67 12 3.5V8M12 7.5V2.5C12 1.67 11.33 1 10.5 1S9 1.67 9 2.5V8M9 6V3.5C9 2.67 8.33 2 7.5 2S6 2.67 6 3.5V11L4 9C3.5 8.5 2.5 8.5 2 9C1.5 9.5 1.5 10.5 2 11L7 17H15C16.1 17 17 16.1 17 15V10.5C17 9.67 16.33 9 15.5 9S14 9.67 14 10.5" fill="currentColor" />
  </svg>
)

const RunningIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="3.5" r="2" fill="currentColor" />
    <path d="M7 8L10 6L13 9L16 8M5 18L8 12L11 13L13 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SmileyIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" fill="currentColor" />
    <circle cx="7" cy="8" r="1" fill="white" />
    <circle cx="13" cy="8" r="1" fill="white" />
    <path d="M6.5 12C7.5 14 12.5 14 13.5 12" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

interface TargetItem {
  name: string
  icon: "speech" | "heart"
  statusLabel: string
  statusColor: string
  progress: string
  category: string
}

const skillAreas = [
  {
    id: "caregiver-goals",
    name: "Caregiver Goals",
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-50",
    icon: <DiamondIcon />,
    targets: [] as TargetItem[],
    expanded: false,
  },
  {
    id: "cognition",
    name: "Cognition",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50",
    icon: <BrainIcon />,
    targets: [] as TargetItem[],
    expanded: false,
  },
  {
    id: "communication",
    name: "Communication",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    icon: <SpeechIcon />,
    targets: [
      {
        name: "Mand for pizza only after breakfast time",
        icon: "speech" as const,
        statusLabel: "In Treatment",
        statusColor: "bg-blue-50 text-blue-700",
        progress: "17% Independent last session",
        category: "Communication / Mand",
      },
      {
        name: "Mand for pizza only after breakfast time",
        icon: "heart" as const,
        statusLabel: "In Treatment",
        statusColor: "bg-blue-50 text-blue-700",
        progress: "17% Independent last session",
        category: "Communication / Mand",
      },
      {
        name: "Ask nicely for the car",
        icon: "speech" as const,
        statusLabel: "In Treatment",
        statusColor: "bg-blue-50 text-blue-700",
        progress: "17% Independent last session",
        category: "Communication / Mand",
      },
    ],
    expanded: true,
  },
  {
    id: "fine-motor",
    name: "Fine Motor",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    icon: <HandIcon />,
    targets: [] as TargetItem[],
    expanded: false,
  },
  {
    id: "gross-motor",
    name: "Gross Motor",
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
    icon: <RunningIcon />,
    targets: [] as TargetItem[],
    expanded: false,
  },
  {
    id: "pairing",
    name: "Pairing",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    icon: <SmileyIcon />,
    targets: [] as TargetItem[],
    expanded: false,
  },
]

export default function PatientDetailPage() {
  const { data, loading, error } = usePatientChart("PAT-2024-0156")
  const [activeTab, setActiveTab] = useState<"skills" | "behaviors">("skills")
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({
    communication: true,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-gray-500">Loading patient data...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-red-600">{error || "Patient not found"}</span>
      </div>
    )
  }

  const toggleArea = (id: string) => {
    setExpandedAreas((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Back button */}
      <div className="px-6 pt-6">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to patient
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col bg-white border-b px-6 py-6">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Samantha Green</h1>
        </div>
      </div>

      {/* Tabs: Skills | Behaviors */}
      <div className="flex flex-row border-b border-gray-200 px-6">
        <button
          type="button"
          onClick={() => setActiveTab("skills")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "skills"
              ? "bg-indigo-50 text-indigo-700 border-indigo-700"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Skills
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("behaviors")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "behaviors"
              ? "bg-indigo-50 text-indigo-700 border-indigo-700"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Behaviors
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 gap-4">
        {/* All targets header */}
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">All targets</h2>
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 font-medium">3</Badge>
        </div>

        {/* Skill Area label */}
        <div className="flex flex-row items-center">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Area</span>
        </div>

        {/* Skill areas */}
        <div className="flex flex-col gap-2">
          {skillAreas.map((area) => {
            const isExpanded = expandedAreas[area.id] ?? area.expanded
            return (
              <Card key={area.id}>
                <CardContent className="p-0">
                  <button
                    type="button"
                    onClick={() => toggleArea(area.id)}
                    className="w-full flex flex-row items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${area.iconBg} ${area.iconColor}`}>
                      {area.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{area.name}</span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {/* Section title */}
                      <div className="px-4 py-2 pl-[60px]">
                        <h3 className="text-sm font-semibold text-gray-900">{area.name}</h3>
                      </div>

                      {/* Target rows */}
                      {area.targets.map((target, idx) => (
                        <div
                          key={idx}
                          className="flex flex-row items-center gap-3 px-4 py-2.5 pl-[60px] border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          <Checkbox className="flex-shrink-0" />
                          <span className={`flex items-center justify-center w-6 h-6 flex-shrink-0 ${
                            target.icon === "speech" ? "text-blue-600" : "text-red-400"
                          }`}>
                            {target.icon === "speech" ? <SpeechIcon /> : <HeartIcon />}
                          </span>
                          <span className="text-sm text-gray-900 font-medium">{target.name}</span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${target.statusColor}`}>
                            {target.statusLabel}
                          </span>
                          <span className="text-xs text-gray-500">{target.progress}</span>
                          <span className="text-xs text-gray-400 ml-auto">{target.category}</span>
                        </div>
                      ))}

                      {/* Create Skill button */}
                      <div className="px-4 py-2 pl-[60px]">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Create Skill
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
