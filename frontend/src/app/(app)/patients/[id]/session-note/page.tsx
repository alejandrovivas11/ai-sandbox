"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Target, ChevronRight, ChevronDown, Diamond, Brain, MessageCircle, Heart, MoreVertical, Plus, Leaf, Hand, Library, Eye } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

export default function SessionNotePage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string
  const [activeTab, setActiveTab] = useState<"skills" | "behaviors">("skills")
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({
    communication: true,
  })

  const toggleArea = (area: string) => {
    setExpandedAreas((prev) => ({ ...prev, [area]: !prev[area] }))
  }

  return (
    <div className="flex flex-row flex-1">
      {/* Sidebar breadcrumb navigation */}
      <aside className="w-[240px] border-r border-gray-200 p-4 flex flex-col gap-2">
        <nav className="flex flex-row items-center gap-1 text-sm text-gray-500">
          <Link href="/patients" className="hover:text-gray-700">Patients</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={"/patients/" + patientId} className="hover:text-gray-700">Samantha Green</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">Treatment</span>
        </nav>
      </aside>

      <div className="flex flex-col flex-1 p-6 gap-6">
      {/* render_sequence[0]: Back button and patient name header */}
      <div className="flex flex-col gap-4">
        <Link
          href={"/patients/" + patientId}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to patient
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Samantha Green</h1>
      </div>

      {/* render_sequence[1]: Skills / Behaviors tabs */}
      <div className="flex flex-row gap-0 border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "skills"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("skills")}
        >
          Skills
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "behaviors"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("behaviors")}
        >
          Behaviors
        </button>
      </div>

      {/* render_sequence[2]: All targets row */}
      <div className="flex flex-row items-center gap-2 py-2">
        <Eye className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-900">All targets</span>
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 ml-1 text-xs px-2 py-0.5">
          3
        </Badge>
      </div>

      {/* render_sequence[3]: Skill Area label */}
      <div>
        <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 text-xs font-medium px-2 py-0.5">
          Skill Area
        </Badge>
      </div>

      {/* render_sequence[4]: Skill area groups */}
      <div className="flex flex-col gap-1">
        {/* Caregiver Goals */}
        <button
          className="flex flex-row items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-50 w-full text-left"
          onClick={() => toggleArea("caregiverGoals")}
        >
          <Diamond className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900 flex-1">Caregiver Goals</span>
          {expandedAreas.caregiverGoals ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Cognition */}
        <button
          className="flex flex-row items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-50 w-full text-left"
          onClick={() => toggleArea("cognition")}
        >
          <Brain className="w-4 h-4 text-pink-500" />
          <span className="text-sm font-medium text-gray-900 flex-1">Cognition</span>
          {expandedAreas.cognition ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Communication (expanded) */}
        <div>
          <button
            className="flex flex-row items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-50 w-full text-left"
            onClick={() => toggleArea("communication")}
          >
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 flex-1">Communication</span>
            {expandedAreas.communication ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedAreas.communication && (
            <div className="ml-9 flex flex-col gap-0 mt-1">
              {/* Page title */}
              <div className="flex flex-row items-center gap-2 px-3 py-2">
                <h2 className="text-[16px] font-semibold text-gray-900">Communication</h2>
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs px-2 py-0.5">3</Badge>
              </div>

              {/* First target row */}
              <div className="flex flex-row items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 group">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <MessageCircle className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-sm text-gray-900 flex-1">Mand for pizza only after breakfast time</span>
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">In Treatment</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">17% Independent last session</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">Communication / Mand</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">Today @ 9:14 AM</span>
                <button className="p-1 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
              </div>

              {/* Second target row */}
              <div className="flex flex-row items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 group">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <Heart className="w-4 h-4 text-pink-500 shrink-0" />
                <span className="text-sm text-gray-900 flex-1">Mand for pizza only after breakfast time</span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Active</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">17% Independent last session</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">Communication / Mand</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">Today @ 9:14 AM</span>
                <button className="p-1 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
              </div>

              {/* Third target row */}
              <div className="flex flex-row items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 group">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <MessageCircle className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-sm text-gray-900 flex-1">Ask nicely for the car</span>
                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">On Hold</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">17% Independent last session</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">Communication / Mand</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">Today @ 9:14 AM</span>
                <button className="p-1 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
              </div>

              {/* Labeling of Community child item */}
              <label className="flex flex-row items-center gap-2 px-3 py-2 ml-4 rounded-md hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-gray-700">Labeling of Community...</span>
                <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 text-xs px-2 py-0.5 ml-1">Badge</Badge>
              </label>

              {/* Helpers Based on Actions child item */}
              <label className="flex flex-row items-center gap-2 px-3 py-2 ml-4 rounded-md hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-gray-700">Helpers Based on Actions</span>
              </label>

              {/* Add from library button */}
              <button className="flex flex-row items-center gap-2 px-3 py-2 ml-4 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md">
                <Library className="w-4 h-4" />
                <span>Add from library</span>
              </button>
            </div>
          )}
        </div>

        {/* Daily Living (collapsed) */}
        <button
          className="flex flex-row items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-50 w-full text-left"
          onClick={() => toggleArea("dailyLiving")}
        >
          <Diamond className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-900 flex-1">Daily Living</span>
          {expandedAreas.dailyLiving ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Fine Motor (collapsed) */}
        <button
          className="flex flex-row items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-50 w-full text-left"
          onClick={() => toggleArea("fineMotor")}
        >
          <Hand className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-900 flex-1">Fine Motor</span>
          {expandedAreas.fineMotor ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Gross Motor (collapsed) */}
        <button
          className="flex flex-row items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-50 w-full text-left"
          onClick={() => toggleArea("grossMotor")}
        >
          <Leaf className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900 flex-1">Gross Motor</span>
          {expandedAreas.grossMotor ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
    </div>
  )
}
