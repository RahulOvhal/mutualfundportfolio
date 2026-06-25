import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Treemap,
  CartesianGrid
} from 'recharts'

import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiLayers,
  FiBriefcase,
  FiActivity,
} from 'react-icons/fi'
import { useAppSelector } from '../../store/hooks.ts'
import { Card } from '../../components/common/Card.tsx'
import { EmptyState } from '../../components/common/EmptyState.tsx'
import { SkeletonChart } from '../../components/skeletons/SkeletonChart.tsx'
import { SkeletonTable } from '../../components/skeletons/SkeletonTable.tsx'
import { Button } from '../../components/common/Button.tsx'
import { ReusableTable } from '../../components/common/ReusableTable.tsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6']

const formatCurrency = (value: number) => `₹${value.toFixed(2)}`

const formatTooltipValue = (value: unknown) => {
  const normalizedValue = Array.isArray(value) ? value[0] : value
  const numericValue =
    typeof normalizedValue === 'number'
      ? normalizedValue
      : Number(normalizedValue ?? 0)

  return formatCurrency(numericValue)
}

export const InvestorDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { investors, holdings, status } = useAppSelector((state) => state.portfolio)
  const investor = investors.find((item) => item.id === id)
  const schemes = investor ? holdings[investor.id] ?? [] : []
  const [schemeSearch, setSchemeSearch] = useState('')

  const filteredSchemes = useMemo(
    () =>
      schemes.filter((scheme) =>
        scheme.schemeName.toLowerCase().includes(schemeSearch.toLowerCase()),
      ),
    [schemes, schemeSearch],
  )

  const schemeColumns = useMemo(
    () => [
      {
        accessorKey: 'schemeName',
        header: 'Scheme Name',
      },
      {
        accessorKey: 'folioNumber',
        header: 'Folio Number',
      },
      {
        accessorKey: 'unitsHeld',
        header: 'Units Held',
      },
      {
        accessorKey: 'averageNav',
        header: 'Average Purchase NAV',
        cell: (info: any) => {
          const value = info.getValue() as number
          return `₹${value.toFixed(2)}`
        },
      },
      {
        accessorKey: 'currentNav',
        header: 'Current NAV',
        cell: (info: any) => {
          const value = info.getValue() as number
          return `₹${value.toFixed(2)}`
        },
      },
      {
        accessorKey: 'investedAmount',
        header: 'Invested Amount',
        cell: (info: any) => {
          const value = info.getValue() as number
          return `₹${value.toFixed(2)}`
        },
      },
      {
        accessorKey: 'currentValue',
        header: 'Current Value',
        cell: (info: any) => {
          const value = info.getValue() as number
          return `₹${value.toFixed(2)}`
        },
      },
      {
        accessorKey: 'gainLoss',
        header: 'Gain/Loss',
        cell: (info: any) => {
          const value = info.getValue() as number
          return (
            <span style={{ color: value >= 0 ? '#10B981' : '#EF4444', fontFamily: 'JetBrains Mono, monospace' }}>
              {value >= 0 ? '+' : ''}₹{value.toFixed(2)}
            </span>
          )
        },
      },
      {
        accessorKey: 'returnPercent',
        header: 'Return (%)',
        cell: (info: any) => {
          const value = info.getValue() as number
          return (
            <span style={{ color: value >= 0 ? '#10B981' : '#EF4444', fontFamily: 'JetBrains Mono, monospace' }}>
              {value >= 0 ? '+' : ''}{value.toFixed(2)}%
            </span>
          )
        },
      },
      {
        accessorKey: 'xirr',
        header: 'XIRR (%)',
        cell: (info: any) => {
          const value = info.getValue() as number | null
          if (value === null) return <span style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>N/A</span>
          return (
            <span style={{ color: value >= 0 ? '#10B981' : '#EF4444', fontFamily: 'JetBrains Mono, monospace' }}>
              {value >= 0 ? '+' : ''}{value.toFixed(2)}%
            </span>
          )
        },
      },
    ],
    [],
  )

  const summary = useMemo(() => {
    const totalInvested = investor?.investedAmount ?? 0
    const currentValue = investor?.currentValue ?? 0
    const gainLoss = investor?.gainLoss ?? 0
    const returnPercent = totalInvested === 0 ? 0 : (gainLoss / totalInvested) * 100
    return {
      totalInvested,
      currentValue,
      gainLoss,
      returnPercent,
      xirr: investor?.xirr ?? null,
      schemeCount: schemes.length,
      folioCount: new Set(schemes.map((scheme) => scheme.folioNumber)).size,
    }
  }, [investor, schemes])

  const stats = [
    {
      title: 'Total Invested',
      value: formatCurrency(summary.totalInvested),
      icon: FiDollarSign,
      tone: 'slate',
    },
    {
      title: 'Current Value',
      value: formatCurrency(summary.currentValue),
      icon: FiPieChart,
      tone: 'blue',
    },
    {
      title: 'Gain / Loss',
      value: `${summary.gainLoss >= 0 ? '+' : ''}${formatCurrency(summary.gainLoss)}`,
      icon: summary.gainLoss >= 0 ? FiTrendingUp : FiTrendingDown,
      tone: summary.gainLoss >= 0 ? 'emerald' : 'rose',
    },
    {
      title: 'Absolute Return',
      value: `${summary.returnPercent >= 0 ? '+' : ''}${summary.returnPercent.toFixed(2)}%`,
      icon: FiActivity,
      tone: summary.returnPercent >= 0 ? 'emerald' : 'rose',
    },
    {
      title: 'XIRR',
      value:
        summary.xirr === null
          ? 'N/A'
          : `${summary.xirr >= 0 ? '+' : ''}${summary.xirr.toFixed(2)}%`,
      icon: FiTrendingUp,
      tone:
        summary.xirr === null
          ? 'slate'
          : summary.xirr >= 0
            ? 'emerald'
            : 'rose',
    },
    {
      title: 'Schemes',
      value: summary.schemeCount,
      icon: FiLayers,
      tone: 'slate',
    },
    {
      title: 'Folios',
      value: summary.folioCount,
      icon: FiBriefcase,
      tone: 'slate',
    },
  ]

  const assetAllocationData = useMemo(
    () =>
      schemes.map((scheme) => ({
        name: scheme.schemeName,
        value: scheme.currentValue,
      })),
    [schemes],
  )

  const investmentVsCurrentData = useMemo(
    () =>
      schemes.map((scheme) => ({
        name: scheme.schemeName,
        invested: scheme.investedAmount,
        current: scheme.currentValue,
      })),
    [schemes],
  )

  const returnDistributionData = useMemo(
    () =>
      schemes.map((scheme) => ({
        name: scheme.schemeName,
        returnPercent: scheme.returnPercent,
      })),
    [schemes],
  )

  const topHoldingsData = useMemo(
    () =>
      [...schemes]
        .sort((a, b) => b.currentValue - a.currentValue)
        .slice(0, 5)
        .map((scheme) => ({
          name: scheme.schemeName,
          value: scheme.currentValue,
        })),
    [schemes],
  )

  const [, setIsTablePdfExporting] = useState(false)

  const exportTablePdf = () => {
    setIsTablePdfExporting(true)
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'landscape' })

      doc.setFontSize(13)
      doc.setTextColor(40)
      doc.text(`Scheme Holdings — ${investor?.name ?? ''}`, 40, 36)
      doc.setFontSize(9)
      doc.setTextColor(120)
      doc.text(`PAN: ${investor?.pan ?? 'N/A'}   |   Exported: ${new Date().toLocaleDateString('en-IN')}`, 40, 52)

      const head = [['Scheme Name', 'Folio', 'Units', 'Avg NAV', 'Curr NAV', 'Invested', 'Curr Value', 'Gain/Loss', 'Return %', 'XIRR %']]
      const body = filteredSchemes.map((s) => [
        s.schemeName,
        s.folioNumber,
        s.unitsHeld,
        `₹${s.averageNav.toFixed(2)}`,
        `₹${s.currentNav.toFixed(2)}`,
        `₹${s.investedAmount.toFixed(2)}`,
        `₹${s.currentValue.toFixed(2)}`,
        `${s.gainLoss >= 0 ? '+' : ''}₹${s.gainLoss.toFixed(2)}`,
        `${s.returnPercent >= 0 ? '+' : ''}${s.returnPercent.toFixed(2)}%`,
        s.xirr === null ? 'N/A' : `${s.xirr >= 0 ? '+' : ''}${s.xirr.toFixed(2)}%`,
      ])

      autoTable(doc, {
        head,
        body,
        startY: 64,
        styles: {
          font: 'courier',
          fontSize: 7.5,
          cellPadding: 4,
          textColor: [30, 30, 30],
        },
        headStyles: {
          fillColor: [7, 11, 20],
          textColor: [148, 163, 184],
          fontStyle: 'bold',
          fontSize: 7,
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        didParseCell: (data) => {
          if (data.section === 'body') {
            const raw = String(data.cell.raw ?? '')
            if (raw.startsWith('+')) data.cell.styles.textColor = [16, 185, 129]
            else if (raw.startsWith('-')) data.cell.styles.textColor = [239, 68, 68]
          }
        },
        margin: { left: 40, right: 40 },
      })

      doc.save(`scheme-holdings-${investor?.name ?? 'export'}.pdf`)
    } finally {
      setIsTablePdfExporting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="space-y-4">
        <SkeletonChart />
        <SkeletonTable />
      </div>
    )
  }

  if (!investor) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          title="Investor not found"
          description="Select a valid investor from the dashboard."
        />
        <div className="flex justify-center">
          <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
        </div>
      </div>
    )
  }

  const holdingColors = [
    '#10B981',
    '#3B82F6',
    '#8B5CF6',
    '#F59E0B',
    '#06B6D4',
  ]
  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-500">Investor details</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{investor.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              PAN:
              <span className="font-mono text-sm">{investor.pan}</span>
            </span>
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Dashboard
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          const theme =
            item.tone === 'emerald'
              ? {
                accent: 'var(--pd-green)',
                bg: 'rgba(16,185,129,0.08)',
                value: 'text-[var(--pd-green)]',
              }
              : item.tone === 'rose'
                ? {
                  accent: 'var(--pd-red)',
                  bg: 'rgba(239,68,68,0.08)',
                  value: 'text-[var(--pd-red)]',
                }
                : item.tone === 'blue'
                  ? {
                    accent: '#3B82F6',
                    bg: 'rgba(59,130,246,0.08)',
                    value: '',
                  }
                  : {
                    accent: "#64748B",
                    bg: 'var(--pd-surface)',
                    value: '',
                  }

          return (
            <div
              key={item.title}
              className="
          group
          relative
          overflow-hidden
          rounded-[18px]
          border
          p-5
          transition-all
          duration-300
          hover:-translate-y-1
        "
              style={{
                background: 'var(--pd-card)',
                borderColor: 'var(--pd-border)',
              }}
            >
              {/* Accent Strip */}
              <div
                className="absolute left-0 top-0 h-full w-1"
                style={{
                  background: theme.accent,
                }}
              />

              {/* Glow */}
              {/* <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${theme.bg} 0%, transparent 70%)`,
          }}
        /> */}

              <div className="relative z-10 flex items-start justify-between">
                <div className="min-w-0">
                  <p
                    className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{
                      color: 'var(--pd-text-3)',
                    }}
                  >
                    {item.title}
                  </p>

                  <h3
                    className={`font-mono text-xl font-bold ${theme.value}`}
                    style={
                      !theme.value
                        ? {
                          color: 'var(--pd-text-1)',
                        }
                        : undefined
                    }
                  >
                    {item.value}
                  </h3>
                </div>

                <div
                  className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-6
            "
                  style={{
                    background: theme.bg,
                    border: `1px solid ${theme.accent}20`,
                    color: theme.accent,
                  }}
                >
                  <Icon size={22} />
                </div>
              </div>


            </div>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div
          className="
    rounded-2xl
    border
    p-5
    backdrop-blur-sm
  "
          style={{
            background: 'var(--pd-card)',
            borderColor: 'var(--pd-border)',
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h3
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'var(--pd-text-3)' }}
            >
              Asset Allocation
            </h3>
          </div>

          {assetAllocationData.length === 0 ? (
            <EmptyState title="No allocation data" description="There are no scheme holdings available." />
          ) : (
            <div>
              {/* Chart */}
              <div className="relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={assetAllocationData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: 'var(--pd-card)',
                        border: '1px solid var(--pd-border)',
                        borderRadius: '12px',
                        color: 'var(--pd-text-1)',
                      }}
                      formatter={(value: unknown) => [
                        formatTooltipValue(value),
                        'Current Value',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Content */}
                <div className="pointer-events-none absolute text-center">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.15em]"
                    style={{ color: 'var(--pd-text-3)' }}
                  >
                    Total
                  </p>

                  <p
                    className="mt-1 font-mono text-lg font-bold"
                    style={{ color: 'var(--pd-text-1)' }}
                  >
                    {formatCurrency(
                      assetAllocationData.reduce(
                        (sum, item) => sum + item.value,
                        0,
                      ),
                    )}
                  </p>
                </div>
              </div>

              {/* Allocation Cards */}
              <div className="mt-2 space-y-3">
                {assetAllocationData.map((item, index) => {
                  const total = assetAllocationData.reduce(
                    (sum, x) => sum + x.value,
                    0,
                  )

                  const percentage = (
                    (item.value / total) *
                    100
                  ).toFixed(1)

                  return (
                    <div
                      key={item.name}
                      className="
            flex
            items-center
            justify-between
            rounded-xl
            border
            p-3
            transition-all
            duration-200
            hover:-translate-y-0.5
          "
                      style={{
                        background: 'var(--pd-surface)',
                        borderColor: 'var(--pd-border)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            background:
                              colors[index % colors.length],
                          }}
                        />

                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{
                              color: 'var(--pd-text-1)',
                            }}
                          >
                            {item.name}
                          </p>

                          <p
                            className="text-xs"
                            style={{
                              color: 'var(--pd-text-3)',
                            }}
                          >
                            {percentage}% allocation
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className="font-mono text-sm font-bold"
                          style={{
                            color: 'var(--pd-text-1)',
                          }}
                        >
                          {formatCurrency(item.value)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          )}


        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-sm"
          style={{
            background: 'var(--pd-card)',
            borderColor: 'var(--pd-border)',
          }}
        >
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h3
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                color: 'var(--pd-text-3)',
              }}
            >
              Invested vs Current Value
            </h3>
          </div>

          {investmentVsCurrentData.length === 0 ? (
            <EmptyState
              title="No investment data"
              description="There are no scheme holdings available."
            />
          ) : (
            <>
              {/* Chart */}
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[...investmentVsCurrentData].sort(
                    (a, b) => b.current - a.current,
                  )}
                  layout="vertical"
                  margin={{
                    top: 0,
                    right: 15,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--pd-border)"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#94A3B8',
                      fontSize: 11,
                    }}
                    tickFormatter={(value) =>
                      `₹${Number(value / 1000).toFixed(0)}K`
                    }
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#94A3B8',
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: 'var(--pd-card)',
                      border: '1px solid var(--pd-border)',
                      borderRadius: '12px',
                      color: 'var(--pd-text-1)',
                    }}
                    formatter={(value: unknown) => [
                      formatTooltipValue(value),
                      '',
                    ]}
                  />

                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 12,
                      color: '#94A3B8',
                    }}
                  />

                  <Bar
                    name="Invested"
                    dataKey="invested"
                    fill="#3B82F6"
                    radius={[0, 8, 8, 0]}
                  />

                  <Bar
                    name="Current"
                    dataKey="current"
                    fill="#10B981"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Compact Holdings */}
              <div className="mt-4 space-y-2">
                {investmentVsCurrentData
                  .sort((a, b) => b.current - a.current)
                  .slice(0, 5)
                  .map((item,index) => {
                    const gain = item.current - item.invested

                    return (
                      <div
                        key={item.name}
                      className="
            flex
            items-center
            justify-between
            rounded-xl
            border
            p-3
            transition-all
            duration-200
            hover:-translate-y-0.5
          "
                      style={{
                        background: 'var(--pd-surface)',
                        borderColor: 'var(--pd-border)',
                      }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            background:
                              colors[index % colors.length],
                          }}
                        />
                          <div
                          
                          >
                             <p
                            className="text-sm font-semibold"
                            style={{
                              color: 'var(--pd-text-1)',
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{
                              color: 'var(--pd-text-3)',
                            }}
                          >
                          Invested {formatCurrency(item.invested)}
                          </p>
                          </div>

                          
                        </div>

                        <div className="text-right">
                          <div
                            className="font-mono text-sm font-semibold"
                            style={{
                              color: 'var(--pd-text-1)',
                            }}
                          >
                            {formatCurrency(item.current)}
                          </div>

                          <div
                            className="text-xs font-medium"
                            style={{
                              color:
                                gain >= 0
                                  ? 'var(--pd-green)'
                                  : 'var(--pd-red)',
                            }}
                          >
                            {gain >= 0 ? '+' : ''}
                            {formatCurrency(gain)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Return Distribution */}
        <div
          className="
    rounded-2xl
    border
    p-5
    backdrop-blur-sm
  "
          style={{
            background: 'var(--pd-card)',
            borderColor: 'var(--pd-border)',
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h3
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'var(--pd-text-3)' }}
            >
              Scheme-wise Return Distribution
            </h3>
          </div>

          {returnDistributionData.length === 0 ? (
            <EmptyState
              title="No return data"
              description="There are no scheme holdings available."
            />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  layout="vertical"
                  data={[...returnDistributionData].sort(
                    (a, b) => b.returnPercent - a.returnPercent,
                  )}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="var(--pd-border)"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#94A3B8',
                      fontSize: 11,
                    }}
                    tickFormatter={(v) => `${v}%`}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#94A3B8',
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: 'var(--pd-card)',
                      border: '1px solid var(--pd-border)',
                      borderRadius: '12px',
                      color: 'var(--pd-text-1)',
                    }}
                    formatter={(value: unknown) => [
                      `${Number(value ?? 0).toFixed(2)}%`,
                      'Return',
                    ]}
                  />

                  <Bar
                    dataKey="returnPercent"
                    radius={[0, 8, 8, 0]}
                  >
                    {returnDistributionData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={
                          item.returnPercent >= 0
                            ? '#10B981'
                            : '#EF4444'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Compact Bottom Stats */}
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[...returnDistributionData]
                  .sort((a, b) => b.returnPercent - a.returnPercent)
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item.name}
                      className="rounded-xl border p-3"
                      style={{
                        background: 'var(--pd-surface)',
                        borderColor: 'var(--pd-border)',
                      }}
                    >
                      <div
                        className="truncate text-xs"
                        style={{
                          color: 'var(--pd-text-2)',
                        }}
                      >
                        {item.name}
                      </div>

                      <div
                        className="mt-1 font-mono text-lg font-semibold"
                        style={{
                          color:
                            item.returnPercent >= 0
                              ? 'var(--pd-green)'
                              : 'var(--pd-red)',
                        }}
                      >
                        {item.returnPercent.toFixed(2)}%
                      </div>

                      <div
                        className="mt-1 text-[11px]"
                        style={{
                          color: 'var(--pd-text-3)',
                        }}
                      >
                        Return
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        {/* Top Holdings */}
        <div
          className="
    rounded-2xl
    border
    p-5
    backdrop-blur-sm
  "
          style={{
            background: 'var(--pd-card)',
            borderColor: 'var(--pd-border)',
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h3
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'var(--pd-text-3)' }}
            >
              Top Holdings by Value
            </h3>
          </div>

          {topHoldingsData.length === 0 ? (
            <EmptyState
              title="No holdings"
              description="There are no scheme holdings available."
            />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <Treemap
                  data={topHoldingsData}
                  dataKey="value"
                  stroke="var(--pd-border)"
                  content={({
                    depth,
                    x,
                    y,
                    width,
                    height,
                    index,
                    name,
                  }: any) => {
                    if (depth !== 1) return <g />

                    return (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          rx={10}
                          fill={
                            holdingColors[
                            index % holdingColors.length
                            ]
                          }
                        />

                        {width > 90 && height > 45 && (
                          <>
                            <text
                              x={x + 10}
                              y={y + 20}
                              fill="#fff"
                              fontSize={11}
                              fontWeight={700}
                            >
                              {name}
                            </text>
                          </>
                        )}
                      </g>
                    )
                  }}
                >
                  <Tooltip
                    contentStyle={{
                      background: 'var(--pd-card)',
                      border: '1px solid var(--pd-border)',
                      borderRadius: '12px',
                      color: 'var(--pd-text-1)',
                    }}
                    formatter={(value: unknown) => [
                      formatTooltipValue(value),
                      'Current Value',
                    ]}
                  />
                </Treemap>
              </ResponsiveContainer>

              {/* Holdings Summary */}
              <div className="mt-4 grid gap-2">
                {topHoldingsData.slice(0, 5).map((holding, index) => {
                  const total = topHoldingsData.reduce(
                    (sum, item) => sum + item.value,
                    0,
                  )

                  const allocation =
                    (holding.value / total) * 100

                  return (
                    <div
                      key={holding.name}
                      className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                px-3
                py-2.5
              "
                      style={{
                        background: 'var(--pd-surface)',
                        borderColor: 'var(--pd-border)',
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{
                            background:
                              holdingColors[
                              index % holdingColors.length
                              ],
                          }}
                        />

                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-medium"
                            style={{
                              color: 'var(--pd-text-1)',
                            }}
                          >
                            {holding.name}
                          </p>

                          <p
                            className="text-[11px]"
                            style={{
                              color: 'var(--pd-text-3)',
                            }}
                          >
                            {allocation.toFixed(1)}% allocation
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className="font-mono text-sm font-semibold"
                          style={{
                            color: 'var(--pd-text-1)',
                          }}
                        >
                          {formatCurrency(holding.value)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <Card >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="mb-5 flex items-center justify-between">
            <h3
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'var(--pd-text-3)' }}
            >
              Scheme Holdings Analysis
            </h3>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 md:min-w-[280px]">
            <svg className="text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
              placeholder="Search scheme..."
              value={schemeSearch}
              onChange={(event) => setSchemeSearch(event.target.value)}
            />
          </div>

        </div>
        {filteredSchemes.length === 0 ? (
          <EmptyState title="No schemes found" description="No matching schemes were found for this investor." />
        ) : (
          <ReusableTable
            data={filteredSchemes}
            columns={schemeColumns}
            tableName="Scheme Holdings Table"
            initialPageSize={10}
            pageSizeOptions={[10, 20, 50]}
            exportFileName="scheme-holdings"
            showGlobalFilter={false}
            enableColumnToggle={true}
            onExportPdf={exportTablePdf}
          />
        )}
      </Card>
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