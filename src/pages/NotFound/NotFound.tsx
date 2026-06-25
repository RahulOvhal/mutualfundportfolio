import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button.tsx'

export const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
    <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button className="mt-8">Go to dashboard</Button>
      </Link>
    </div>
  </div>
)
