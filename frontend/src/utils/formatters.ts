/**
 * Patient-specific formatting utilities for dates, ages, MRN display, and clinical data.
 */

export function formatDate(dateStr: string): string {
  return dateStr
}

export function formatAge(age: number): string {
  return `Age ${age}`
}

export function formatMRN(mrn: string): string {
  return `MRN: ${mrn}`
}

export function formatDOB(dob: string, age: number): string {
  return `DOB: ${dob} (Age ${age})`
}

export function formatAssessmentScore(
  standardScore: number,
  percentile: number
): string {
  return `Standard Score: ${standardScore} (${percentile}${getOrdinalSuffix(percentile)} %ile)`
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export function formatVisitsRemaining(used: number, total: number): string {
  return `${total - used}/${total} visits remaining`
}
