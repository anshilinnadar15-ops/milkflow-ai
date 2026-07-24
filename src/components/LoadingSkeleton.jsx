// Reusable skeleton loaders shown while page data is "loading" from the API.
export function KpiSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 h-[124px] flex flex-col gap-4">
          <div className="skeleton w-10 h-10 rounded-xl" />
          <div className="skeleton h-4 w-2/3 rounded-lg" />
          <div className="skeleton h-3 w-1/2 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <div className="card p-5">
      <div className="skeleton h-4 w-40 rounded-lg mb-4" />
      <div className="skeleton w-full rounded-xl" style={{ height }} />
    </div>
  )
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="card p-5">
      <div className="skeleton h-4 w-48 rounded-lg mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function CardGridSkeleton({ count = 6, height = 180 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton rounded-2xl" style={{ height }} />
      ))}
    </div>
  )
}
