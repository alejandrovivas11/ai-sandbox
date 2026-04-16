"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb"
import { Badge } from "@/components/ui/Badge"
import { Checkbox } from "@/components/ui/Checkbox"
import { MoreVertical } from "lucide-react"

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

interface TargetItem {
  name: string
  icon: "speech" | "heart"
  statusLabel: string
  statusColor: string
  progress: string
  category: string
  timestamp: string
}

const targets: TargetItem[] = [
  {
    name: "Mand for pizza only after breakfast time",
    icon: "speech",
    statusLabel: "In Treatment",
    statusColor: "bg-blue-50 text-blue-700",
    progress: "17% Independent",
    category: "Communication / Mand",
    timestamp: "Today @ 9:14 AM by Sarah J.",
  },
  {
    name: "Mand for pizza only after breakfast time",
    icon: "heart",
    statusLabel: "In Treatment",
    statusColor: "bg-blue-50 text-blue-700",
    progress: "17% Independent",
    category: "Communication / Mand",
    timestamp: "Today @ 9:14 AM by Sarah J.",
  },
  {
    name: "Ask nicely for the car",
    icon: "speech",
    statusLabel: "In Treatment",
    statusColor: "bg-blue-50 text-blue-700",
    progress: "17% Independent",
    category: "Communication / Mand",
    timestamp: "Today @ 9:14 AM by Sarah J.",
  },
]

export default function SessionNotePage() {
  const params = useParams()
  const patientId = params.id as string
  const [activeTab, setActiveTab] = useState<"skills" | "behaviors">("skills")

  return (
    <div className="flex flex-col flex-1">
      {/* Breadcrumb / Sidebar area */}
      <div className="px-6 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/patients/${patientId}`}>Samantha Green</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Treatment</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
      <div className="flex flex-col p-6 gap-6">
        {/* All targets header */}
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">All targets</h2>
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 font-medium">3</Badge>
        </div>

        {/* Communication section */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Communication</h3>
            <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 font-medium">3</Badge>
          </div>
          <p className="text-sm text-gray-500">Labeling of Community Helpers Based on Actions</p>
        </div>

        {/* Target rows */}
        <div className="flex flex-col border rounded-lg divide-y divide-gray-100">
          {targets.map((target, idx) => (
            <div
              key={idx}
              className="flex flex-row items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <Checkbox className="flex-shrink-0" />
              <span
                className={`flex items-center justify-center w-6 h-6 flex-shrink-0 ${
                  target.icon === "speech" ? "text-blue-600" : "text-red-400"
                }`}
              >
                {target.icon === "speech" ? <SpeechIcon /> : <HeartIcon />}
              </span>
              <span className="text-sm text-gray-900 font-medium flex-shrink-0">
                {target.name}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 ${target.statusColor}`}
              >
                {target.statusLabel}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0">{target.progress}</span>
              <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{target.category}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">{target.timestamp}</span>
              <button type="button" className="p-1 flex-shrink-0 text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
