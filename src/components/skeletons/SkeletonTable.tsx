export const SkeletonTable = () => (
  <div className="animate-pulse space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex gap-4">
        <div className="h-8 w-24 rounded-full bg-slate-200" />
        <div className="h-8 flex-1 rounded-full bg-slate-200" />
      </div>
    ))}
  </div>
)
