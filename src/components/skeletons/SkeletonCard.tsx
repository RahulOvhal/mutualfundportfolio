export const SkeletonCard = () => (
  <div className="animate-pulse space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
    <div className="h-6 w-24 rounded-full bg-slate-200" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-28 rounded-3xl bg-slate-200" />
      ))}
    </div>
  </div>
)
