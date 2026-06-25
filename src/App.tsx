import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from './store/index.ts'
import { useAppSelector } from './store/hooks.ts'
import { Login } from './pages/Login/Login.tsx'
import { Dashboard } from './pages/Dashboard/Dashboard.tsx'
import { InvestorDetails } from './pages/InvestorDetails/InvestorDetails.tsx'
import { NotFound } from './pages/NotFound/NotFound.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import { AuthenticatedLayout } from './components/common/AuthenticatedLayout.tsx'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  const auth = useAppSelector((state) => state.auth)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', auth.theme === 'dark')
    root.style.colorScheme = auth.theme
  }, [auth.theme])

  return (
    <BrowserRouter>
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Something went wrong</h1>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                An unexpected error occurred while rendering the application.
              </p>
              <button
                className="mt-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                onClick={resetErrorBoundary}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/investor/:id"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <InvestorDetails />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
      <Toaster position="top-right" />
    </Provider>
  )
}

export default App
