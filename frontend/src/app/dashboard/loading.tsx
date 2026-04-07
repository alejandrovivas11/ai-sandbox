export default function DashboardLoading(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 h-8 w-40 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-border bg-white p-6"
          >
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-2 h-8 w-16 rounded bg-gray-200" />
            <div className="mt-1 h-4 w-32 rounded bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="animate-pulse rounded-lg border border-border bg-white">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
            >
              <div>
                <div className="h-4 w-48 rounded bg-gray-200" />
                <div className="mt-1 h-3 w-24 rounded bg-gray-200" />
              </div>
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
