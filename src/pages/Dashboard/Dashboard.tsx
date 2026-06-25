// import { useEffect, useMemo } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAppDispatch, useAppSelector } from '../../store/hooks.ts'
// import { loadPortfolio } from '../../features/portfolio/portfolioSlice.ts'
// import { Card } from '../../components/common/Card.tsx'
// import { EmptyState } from '../../components/common/EmptyState.tsx'
// import { SkeletonTable } from '../../components/skeletons/SkeletonTable.tsx'
// import { ReusableTable } from '../../components/common/ReusableTable.tsx'
// import type { ColumnDef } from '@tanstack/react-table'
// import type { InvestorSummary } from '../../features/portfolio/portfolioSlice.ts'

// export const Dashboard = () => {
//   const dispatch = useAppDispatch()
//   const { investors, status, error } = useAppSelector((state) => state.portfolio)
//   const navigate = useNavigate()

//   useEffect(() => {
//     dispatch(loadPortfolio())
//   }, [dispatch])

//   const columns = useMemo<ColumnDef<InvestorSummary>[]>(
//     () => [
//       {
//         accessorKey: 'name',
//         header: 'Investor Name',
//       },
//       {
//         accessorKey: 'pan',
//         header: 'PAN Number',
//       },
//       {
//         accessorKey: 'folioCount',
//         header: 'Folio Count',
//       },
//       {
//         accessorKey: 'investedAmount',
//         header: 'Total Investment Amount',
//         cell: (info) => `₹${info.getValue<number>().toFixed(2)}`,
//       },
//       {
//         accessorKey: 'currentValue',
//         header: 'Current Portfolio Value',
//         cell: (info) => `₹${info.getValue<number>().toFixed(2)}`,
//       },
//       {
//         accessorKey: 'gainLoss',
//         header: 'Absolute Gain/Loss',
//         cell: (info) => `₹${info.getValue<number>().toFixed(2)}`,
//       },
//       {
//         accessorKey: 'xirr',
//         header: 'XIRR (%)',
//         cell: (info) => {
//           const value = info.getValue<number | null>()
//           return value === null ? 'N/A' : `${value.toFixed(2)}%`
//         },
//       },
//     ],
//     [],
//   )

//   const handleRowClick = (investor: InvestorSummary) => {
//     navigate(`/investor/${investor.id}`)
//   }

//   if (status === 'failed') {
//     return (
//       <div className="px-4 py-6 sm:px-6 lg:px-8">
//         <EmptyState
//           title="Unable to load portfolio"
//           description={error ?? 'There was a problem reading the portfolio data.'}
//         />
//       </div>
//     )
//   }

//   if (status === 'loading') {
//     return <SkeletonTable />
//   }

//   return (
//     <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
//       <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">Investors</p>
//           <h1 className="mt-2 text-2xl font-semibold text-slate-900">Portfolio Dashboard</h1>
//         </div>
//       </div>

//       {investors.length === 0 ? (
//         <EmptyState title="No investors found" description="Try adjusting your search or filter criteria." />
//       ) : (
//         <Card>
//           <ReusableTable
//             data={investors}
//             columns={columns}
//             tableName="Investors"
//             initialPageSize={5}
//             pageSizeOptions={[5, 10, 20]}
//             onRowClick={handleRowClick}
//             exportFileName="investor-portfolio"
//             enableColumnToggle
//           />
//         </Card>
//       )}
//     </div>
//   )
// }



import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts'
import { loadPortfolio } from '../../features/portfolio/portfolioSlice.ts'
import { EmptyState } from '../../components/common/EmptyState.tsx'
import { SkeletonTable } from '../../components/skeletons/SkeletonTable.tsx'
import { ReusableTable } from '../../components/common/ReusableTable.tsx'
import type { ColumnDef } from '@tanstack/react-table'
import type { InvestorSummary } from '../../features/portfolio/portfolioSlice.ts'

export const Dashboard = () => {
  const dispatch = useAppDispatch()
  const { investors, status, error } = useAppSelector((state) => state.portfolio)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(loadPortfolio())
  }, [dispatch])

  const columns = useMemo<ColumnDef<InvestorSummary>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Investor Name',
        cell: (info) => (
          <span className="font-medium" style={{ color: 'var(--pd-text-primary)' }}>
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'pan',
        header: 'PAN Number',
        cell: (info) => (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--pd-text-muted)' }}>
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'folioCount',
        header: 'Folio Count',
        cell: (info) => (
          <span className="inline-block rounded-full px-2.5 py-0.5 text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace", background: 'var(--pd-surface)', border: '1px solid var(--pd-border2)', color: 'var(--pd-text-secondary)' }}>
            {info.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'investedAmount',
        header: 'Total Investment Amount',
        cell: (info) => (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--pd-text-secondary)' }}>
            ₹{info.getValue<number>().toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'currentValue',
        header: 'Current Portfolio Value',
        cell: (info) => (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--pd-text-secondary)' }}>
            ₹{info.getValue<number>().toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'gainLoss',
        header: 'Absolute Gain/Loss',
        cell: (info) => {
          const v = info.getValue<number>()
          return (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: v >= 0 ? 'var(--pd-green)' : 'var(--pd-red)' }}>
              {v >= 0 ? '+' : ''}₹{v.toFixed(2)}
            </span>
          )
        },
      },
      {
        accessorKey: 'xirr',
        header: 'XIRR (%)',
        cell: (info) => {
          const value = info.getValue<number | null>()
          if (value === null) return <span style={{ color: 'var(--pd-text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>N/A</span>
          return (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: value >= 0 ? 'var(--pd-green)' : 'var(--pd-red)' }}>
              {value >= 0 ? '+' : ''}{value.toFixed(2)}%
            </span>
          )
        },
      },
    ],
    [],
  )

  const handleRowClick = (investor: InvestorSummary) => {
    navigate(`/investor/${investor.id}`)
  }

  if (status === 'failed') {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <EmptyState
          title="Unable to load portfolio"
          description={error ?? 'There was a problem reading the portfolio data.'}
        />
      </div>
    )
  }

  if (status === 'loading') {
    return <SkeletonTable />
  }

  return (
    <div className="space-y-5  py-6 " style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Page header ── */}
      <div
        className="flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: 'var(--pd-card)', border: '1px solid var(--pd-border)' }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1"
             style={{ color: 'var(--pd-green)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
            Investors
          </p>
          <h1 className="text-xl font-semibold tracking-tight"
              style={{ color: 'var(--pd-text-primary)' }}>
            Portfolio Dashboard
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--pd-text-muted)' }}>
            Showing all investor summaries
          </p>
        </div>
        <span className="text-xs rounded-full px-3 py-1.5 font-medium whitespace-nowrap"
              style={{ fontFamily: "'JetBrains Mono', monospace", background: 'var(--pd-green-dim)', color: 'var(--pd-green-text)' }}>
          {investors.length} investor{investors.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Table ── */}
      {investors.length === 0 ? (
        <EmptyState title="No investors found" description="Try adjusting your search or filter criteria." />
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--pd-card)', border: '1px solid var(--pd-border)' }}>
          <ReusableTable
            data={investors}
            columns={columns}
            tableName="Investors"
            initialPageSize={5}
            pageSizeOptions={[5, 10, 20]}
            onRowClick={handleRowClick}
            exportFileName="investor-portfolio"
            enableColumnToggle
          />
        </div>
      )}

        <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
    </div>
  )
}