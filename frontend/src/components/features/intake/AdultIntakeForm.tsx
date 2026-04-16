"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Checkbox } from "@/components/ui/Checkbox"
import { Separator } from "@/components/ui/Separator"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select"
import { ADULT_FORM_DATA } from "@/lib/api/intake"

const data = ADULT_FORM_DATA

export function AdultIntakeForm() {
  return (
    <form className="flex flex-col gap-6">
      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input defaultValue={data.demographics.firstName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Middle Name</Label>
              <Input defaultValue={data.demographics.middleName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input defaultValue={data.demographics.lastName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                defaultValue={data.demographics.dateOfBirth}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Gender</Label>
              <Select defaultValue={data.demographics.gender}>
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to answer">
                    Prefer not to answer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Primary Language</Label>
              <Select defaultValue={data.demographics.primaryLanguage}>
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="Mandarin">Mandarin</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication & Voice Concerns */}
      <Card>
        <CardHeader>
          <CardTitle>Communication &amp; Voice Concerns</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Voice Complaints:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hoarseness"
                  defaultChecked={data.voiceConcerns.hoarseness}
                />
                <Label htmlFor="hoarseness">Hoarseness</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="vocal-fatigue"
                  defaultChecked={data.voiceConcerns.vocalFatigue}
                />
                <Label htmlFor="vocal-fatigue">Vocal fatigue</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="loss-vocal-range"
                  defaultChecked={data.voiceConcerns.lossOfVocalRange}
                />
                <Label htmlFor="loss-vocal-range">Loss of vocal range</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="throat-clearing"
                  defaultChecked={data.voiceConcerns.throatClearing}
                />
                <Label htmlFor="throat-clearing">Throat clearing</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swallowing Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Swallowing Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Current IDDSI Diet Level</Label>
              <Select
                defaultValue={
                  data.swallowingAssessment.currentIddsiDietLevel
                }
              >
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Level 7 - Regular">
                    Level 7 - Regular
                  </SelectItem>
                  <SelectItem value="Level 6 - Soft & Bite-sized">
                    Level 6 - Soft &amp; Bite-sized
                  </SelectItem>
                  <SelectItem value="Level 5 - Minced & Moist">
                    Level 5 - Minced &amp; Moist
                  </SelectItem>
                  <SelectItem value="Level 4 - Pureed">
                    Level 4 - Pureed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Current IDDSI Drink Level</Label>
              <Select
                defaultValue={
                  data.swallowingAssessment.currentIddsiDrinkLevel
                }
              >
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Level 0 - Thin">
                    Level 0 - Thin
                  </SelectItem>
                  <SelectItem value="Level 1 - Slightly Thick">
                    Level 1 - Slightly Thick
                  </SelectItem>
                  <SelectItem value="Level 2 - Mildly Thick">
                    Level 2 - Mildly Thick
                  </SelectItem>
                  <SelectItem value="Level 3 - Moderately Thick">
                    Level 3 - Moderately Thick
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screening Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Screening Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-900">
              EAT-10 Swallowing Assessment
            </p>
            <p className="text-sm text-yellow-600 mb-3">
              Total Score: {data.screeningTools.eat10Score} (
              {data.screeningTools.eat10Interpretation})
            </p>
            <Separator className="my-3" />
            <p className="text-sm font-medium text-gray-900">
              VHI-10 Voice Handicap Index
            </p>
            <p className="text-sm text-yellow-600">
              Total Score: {data.screeningTools.vhi10Score} (
              {data.screeningTools.vhi10Interpretation})
            </p>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
