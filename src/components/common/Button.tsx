import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const baseClasses = 'inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60'

const variantClasses = {
  primary: 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => (
  <button className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()} {...props} />
)