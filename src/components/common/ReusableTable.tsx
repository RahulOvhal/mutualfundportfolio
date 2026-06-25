import { useEffect, useRef, useState } from 'react'
import type { ColumnDef, RowData, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from './Button'

type ReusableTableProps<TData extends RowData> = {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  tableName?: string
  onRowClick?: (row: TData) => void
  initialPageSize?: number
  pageSizeOptions?: number[]
  defaultSort?: SortingState
  exportFileName?: string
  showGlobalFilter?: boolean
  enableColumnToggle?: boolean
  enablePagination?: boolean
  onExportPdf?:()=> void
}

const escapeCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return ''
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

export function ReusableTable<TData extends RowData>({
  data,
  columns,
  tableName = 'Table',
  onRowClick,
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 20],
  defaultSort = [],
  exportFileName = 'table-export',
  showGlobalFilter = true,
  enableColumnToggle = false,
  enablePagination = true,
  onExportPdf,
}: ReusableTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>(defaultSort)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: enablePagination ? initialPageSize : data.length,
  })
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!enablePagination) setPagination({ pageIndex: 0, pageSize: data.length })
  }, [data.length, enablePagination])

  useEffect(() => {
    if (!enableColumnToggle) return
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setShowColumnMenu(false)
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [enableColumnToggle])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  })

  const sortedRows = table.getSortedRowModel().rows
  const pageCount = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const visibleRows = table.getRowModel().rows
  const leafColumns = table.getAllLeafColumns()

  const exportCsv = () => {
    const visibleColumns = table.getAllLeafColumns().filter((col) => col.getIsVisible())
    const headers = visibleColumns.map((col) => {
      const header = col.columnDef.header
      return typeof header === 'string' ? header : String(header ?? col.id)
    })
    const rows = sortedRows.map((row) =>
      visibleColumns.map((col) => escapeCsvValue(row.getValue(col.id)))
    )
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const filename = `${exportFileName}-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  /* ── shared inline style tokens ── */
  const S = {
    card:   { background: 'var(--pd-card)',    border: '1px solid var(--pd-border)' },
    surface:{ background: 'var(--pd-surface)', border: '1px solid var(--pd-border2)' },
    border: { borderColor: 'var(--pd-border)' },
    mono:   { fontFamily: "'JetBrains Mono', monospace" },
    green:  { color: 'var(--pd-green)' },
    muted:  { color: 'var(--pd-text-muted)' },
    secondary: { color: 'var(--pd-text-secondary)' },
    primary:   { color: 'var(--pd-text-primary)' },
  } as const

  return (
    <div className="overflow-hidden rounded-2xl" style={S.card}>

      {/* ── Header: title + search + actions ── */}
      <div
        className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'var(--pd-border)' }}
      >
        <div>
          <h2 className="text-sm font-semibold" style={S.primary}>{tableName}</h2>
          {/* <p className="mt-0.5 text-xs" style={{ ...S.muted, ...S.mono }}>
            Showing {showingFrom}–{showingTo} of {filteredRowCount} rows
          </p> */}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showGlobalFilter && (
            <label
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ ...S.surface, fontSize: 12 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={S.muted} aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search rows…"
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  width: 150, fontSize: 12, color: 'var(--pd-text-primary)',
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </label>
          )}

          {enableColumnToggle && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowColumnMenu((c) => !c) }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all"
                style={{
                  ...S.surface, color: 'var(--pd-text-secondary)',
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="18"/><rect x="14" y="3" width="7" height="18"/>
                </svg>
                Columns
              </button>

              {showColumnMenu && (
                <div
                  className="absolute right-0 z-20 mt-1.5 w-56 overflow-hidden rounded-xl"
                  style={{ ...S.card, border: '1px solid var(--pd-border2)', top: '100%' }}
                >
                  <div
                    className="border-b px-4 py-2.5 text-xs font-medium uppercase tracking-widest"
                    style={{ borderColor: 'var(--pd-border)', ...S.muted, ...S.mono }}
                  >
                    Toggle columns
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1.5">
                    {leafColumns.map((column) => (
                      <label
                        key={column.id}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all"
                        style={{ color: 'var(--pd-text-secondary)' }}
                      >
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                          style={{ accentColor: 'var(--pd-green)', width: 13, height: 13 }}
                        />
                        {typeof column.columnDef.header === 'string'
                          ? column.columnDef.header
                          : column.id}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
            {/* Export CSV  */}
          <Button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
            style={{
              background: 'var(--pd-green)', border: '1px solid var(--pd-green)',
              color: '#022C22', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </Button>

            {/* Export PDF  */}
            <Button variant="secondary" onClick={onExportPdf} >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Export PDF
                        {/* {isTablePdfExporting ? 'Generating…' : 'Export PDF'} */}
                      </Button>

        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} style={{ borderBottom: '1px solid var(--pd-border)' }}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
                      textTransform: 'uppercase', whiteSpace: 'nowrap',
                      color: 'var(--pd-text-muted)', fontFamily: "'JetBrains Mono', monospace",
                      background: 'var(--pd-surface)',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span style={{ color: 'var(--pd-green)', fontSize: 11 }}>
                        {{ asc: '↑', desc: '↓' }[header.column.getIsSorted() as string] ?? '↕'}
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--pd-text-muted)', fontSize: 13 }}
                >
                  No records available
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default', transition: 'background .1s' }}
                  onMouseEnter={(e) => {
                    if (onRowClick) (e.currentTarget as HTMLElement).style.background = 'var(--pd-surface)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = ''
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '12px 16px', whiteSpace: 'nowrap',
                        borderBottom: '1px solid var(--pd-border)',
                        color: 'var(--pd-text-secondary)', fontSize: 12,
                        verticalAlign: 'middle',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer: pagination ── */}
      <div
        className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'var(--pd-border)' }}
      >
        <p style={{ fontSize: 11, ...S.muted, ...S.mono }}>
          Page {pageIndex + 1} of {pageCount}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2" style={{ fontSize: 11, ...S.muted, ...S.mono }}>
            Rows per page:
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              style={{
                ...S.surface, borderRadius: 7, padding: '4px 8px',
                fontSize: 11, color: 'var(--pd-text-secondary)',
                fontFamily: "'JetBrains Mono', monospace", outline: 'none', cursor: 'pointer',
              }}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>

          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              style={{
                ...S.surface, borderRadius: 7, padding: '5px 12px',
                fontSize: 11, color: 'var(--pd-text-secondary)',
                fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer',
                opacity: !table.getCanPreviousPage() ? 0.35 : 1,
              }}
            >
              ‹ Prev
            </button>
            <button
              type="button"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              style={{
                ...S.surface, borderRadius: 7, padding: '5px 12px',
                fontSize: 11, color: 'var(--pd-text-secondary)',
                fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer',
                opacity: !table.getCanNextPage() ? 0.35 : 1,
              }}
            >
              Next ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}