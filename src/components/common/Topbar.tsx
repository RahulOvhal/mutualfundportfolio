
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts'
import { logout, setTheme } from '../../features/auth/authSlice.ts'

export const Topbar = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.auth.theme)
  const isDark = theme === 'dark'

  return (
    <header className="flex h-[60px] items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <polyline
              points="1,13 5,8 8,11 13,5 17,7"
              stroke="#022C22"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-slate-100">Mutual Fund Portfolio</p>
          <p className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-500 sm:block">
            Portfolio Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-1 hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 sm:flex dark:border-slate-700 dark:bg-slate-800" aria-hidden="true">
          <span className="block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Live
          </span>
        </div>

        <button
          type="button"
          onClick={() => dispatch(setTheme(isDark ? 'light' : 'dark'))}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isDark ? (
              <>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </>
            ) : (
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            )}
          </svg>
          <span className="hidden sm:inline">{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>

        <div className="hidden h-5 w-px bg-slate-200 sm:block dark:bg-slate-700" aria-hidden="true" />

        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}