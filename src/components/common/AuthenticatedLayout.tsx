import type { ReactNode } from 'react'
import { Topbar } from './Topbar.tsx'
import { TICKER_ITEMS } from '../../data/dummyData'

interface AuthenticatedLayoutProps {
  children: ReactNode
}

export const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* ── Ticker bar ── */}
          <div className="overflow-hidden border-b"
               style={{ background: '#0D1321', borderColor: '#1E293B', padding: '10px 0' }}>
            <div className="flex gap-10 whitespace-nowrap"
                 style={{ animation: 'ticker 22s linear infinite', display: 'inline-flex', gap: '40px' }}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-xs"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: '#94A3B8', fontWeight: 500 }}>{t.sym}</span>
                  <span style={{ color: '#E2E8F0' }}>{t.price}</span>
                  <span style={{ color: t.up ? '#10B981' : '#EF4444' }}>
                    {t.up ? '▲' : '▼'} {t.change}
                  </span>
                </span>
              ))}
            </div>
          </div>
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <Topbar />
      <div className="mt-2 pb-10">{children}</div>
    </div>
  </div>
)