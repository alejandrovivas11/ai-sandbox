"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { PediatricIntakeForm } from "@/components/features/intake/PediatricIntakeForm"
import { AdultIntakeForm } from "@/components/features/intake/AdultIntakeForm"

export function IntakeFormTabs() {
  return (
    <Tabs defaultValue="pediatric" className="flex flex-col">
      <TabsList>
        <TabsTrigger value="pediatric">Pediatric Intake</TabsTrigger>
        <TabsTrigger value="adult">Adult Intake</TabsTrigger>
      </TabsList>
      <TabsContent value="pediatric" className="mt-6">
        <PediatricIntakeForm />
      </TabsContent>
      <TabsContent value="adult" className="mt-6">
        <AdultIntakeForm />
      </TabsContent>
    </Tabs>
  )
}
