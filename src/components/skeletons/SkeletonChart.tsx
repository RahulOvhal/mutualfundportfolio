export const SkeletonChart = () => (
  <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6">
    <div className="h-8 w-48 rounded-full bg-slate-200" />
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="h-40 rounded-3xl bg-slate-200" />
      ))}
    </div>
  </div>
)
