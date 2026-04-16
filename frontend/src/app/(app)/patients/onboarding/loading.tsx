import { Skeleton } from "@/components/ui/Skeleton"

export default function OnboardingLoading() {
  return (
    <div className="flex flex-col flex-1 gap-6 p-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  )
}
