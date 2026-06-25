import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

export const Card = ({ title, children, className = '' }: CardProps) => (
  <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 ${className}`.trim()}>
    {title ? <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2> : null}
    {children}
  </section>
)