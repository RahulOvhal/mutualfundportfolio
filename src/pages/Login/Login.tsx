import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch } from '../../store/hooks.ts'
import { loginSuccess } from '../../features/auth/authSlice.ts'
import { loginSchema, type LoginSchema } from '../../utils/validation.ts'
import { Button } from '../../components/common/Button.tsx'
import { TICKER_ITEMS } from '../../data/dummyData'

const demoCredentials = {
  email: 'demo@portfolio.com',
  password: 'Portfolio@123',
}

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    document.title = 'Login – Portfolio Dashboard'
  }, [])

  const onSubmit = (values: LoginSchema) => {
    if (
      values.email === demoCredentials.email &&
      values.password === demoCredentials.password
    ) {
      dispatch(loginSuccess(values.email))
      toast.success('Login successful')
      navigate('/dashboard')
      return
    }
    toast.error('Invalid credentials. Please use the demo credentials.')
  }

  return (
    <div className="min-h-screen w-full flex flex-col"
         style={{ background: '#070B14', fontFamily: "'Inter', sans-serif" }}>

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

      {/* ── Main ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md">

          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                 style={{ background: '#10B981' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <polyline points="1,13 5,8 8,11 13,5 17,7"
                          stroke="#022C22" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                Portfolio Dashboard
              </p>
              <p className="text-xs tracking-widest uppercase"
                 style={{ color: '#10B981', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
                Investor Portal
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8 sm:p-9"
               style={{ background: '#0D1321', border: '1px solid #1E293B' }}>

            <div className="mb-7">
              <h1 className="text-2xl font-semibold tracking-tight mb-1.5"
                  style={{ color: '#F1F5F9' }}>Login to continue</h1>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Access your investment dashboard with the credentials below.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest mb-2"
                       style={{ color: '#94A3B8' }}>Email address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-base"
                        style={{ color: '#334155' }}>✉</span>
                  <input
                    className="w-full rounded-xl text-sm pl-10 pr-4 py-3 outline-none transition-all"
                    style={{
                      background: '#111827',
                      border: errors.email ? '1px solid #EF4444' : '1px solid #1E293B',
                      color: '#E2E8F0',
                    }}
                    type="email"
                    placeholder="demo@portfolio.com"
                    {...register('email')}
                  />
                </div>
                {errors.email?.message && (
                  <p className="mt-1.5 text-xs" style={{ color: '#EF4444' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium uppercase tracking-widest"
                         style={{ color: '#94A3B8' }}>Password</label>
                  <button
                    type="button"
                    className="text-xs transition-colors"
                    style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setShowPassword((c) => !c)}
                  >
                    {showPassword ? 'Hide password' : 'Show password'}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-base"
                        style={{ color: '#334155' }}>🔒</span>
                  <input
                    className="w-full rounded-xl text-sm pl-10 pr-4 py-3 outline-none transition-all"
                    style={{
                      background: '#111827',
                      border: errors.password ? '1px solid #EF4444' : '1px solid #1E293B',
                      color: '#E2E8F0',
                    }}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    {...register('password')}
                  />
                </div>
                {errors.password?.message && (
                  <p className="mt-1.5 text-xs" style={{ color: '#EF4444' }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">Login</Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: '#1E293B' }}></div>
              <span className="text-xs tracking-widest"
                    style={{ color: '#334155', fontFamily: "'JetBrains Mono', monospace" }}>
                DEMO ACCESS
              </span>
              <div className="flex-1 h-px" style={{ background: '#1E293B' }}></div>
            </div>

            {/* Demo credentials */}
            <div className="rounded-xl p-4"
                 style={{
                   background: '#111827',
                   border: '1px solid #1E2D40',
                   borderLeft: '3px solid #10B981',
                 }}>
              <p className="text-xs font-medium uppercase tracking-widest mb-3 flex items-center gap-1.5"
                 style={{ color: '#10B981' }}>
                🔑 Demo credentials
              </p>
              <div className="space-y-2">
                {[
                  { key: 'email', val: demoCredentials.email },
                  { key: 'password', val: demoCredentials.password },
                ].map(({ key, val }) => (
                  <div key={key}
                       className="flex justify-between items-center py-1.5 border-b"
                       style={{ borderColor: '#1E293B', fontFamily: "'JetBrains Mono', monospace" }}>
                    <span className="text-xs" style={{ color: '#475569' }}>{key}</span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      

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



// import { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'sonner'
// import { useAppDispatch } from '../../store/hooks.ts'
// import { loginSuccess } from '../../features/auth/authSlice.ts'
// import { loginSchema, type LoginSchema } from '../../utils/validation.ts'
// import { Button } from '../../components/common/Button.tsx'

// const demoCredentials = {
//   email: 'demo@portfolio.com',
//   password: 'Portfolio@123',
// }

// export const Login = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const navigate = useNavigate()
//   const dispatch = useAppDispatch()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) })

//   useEffect(() => {
//     document.title = 'Login – Portfolio Dashboard'
//   }, [])

//   const onSubmit = (values: LoginSchema) => {
//     if (
//       values.email === demoCredentials.email &&
//       values.password === demoCredentials.password
//     ) {
//       dispatch(loginSuccess(values.email))
//       toast.success('Login successful')
//       navigate('/dashboard')
//       return
//     }
//     toast.error('Invalid credentials. Please use the demo credentials.')
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-xl space-y-8 rounded-3xl bg-white p-10 shadow-lg">
//         <div>
//           <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Portfolio Dashboard</p>
//           <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Login to continue</h1>
//           <p className="mt-3 text-sm leading-6 text-slate-600">
//             Use the credentials shown below to access the investor dashboard.
//           </p>
//         </div>

//         <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div>
//             <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
//             <input
//               className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
//               type="email"
//               {...register('email')}
//             />
//             {errors.email?.message && (
//               <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
//             )}
//           </div>

//           <div>
//             <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
//               <span>Password</span>
//               <button
//                 type="button"
//                 className="text-slate-500 hover:text-slate-700"
//                 onClick={() => setShowPassword((current) => !current)}
//               >
//                 {showPassword ? 'Hide password' : 'Show password'}
//               </button>
//             </div>
//             <input
//               className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
//               type={showPassword ? 'text' : 'password'}
//               {...register('password')}
//             />
//             {errors.password?.message && (
//               <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
//             )}
//           </div>

//           <Button type="submit" className="w-full">Login</Button>
//         </form>

//         <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
//           <h2 className="mb-3 text-base font-semibold text-slate-900">Demo Credentials</h2>
//           <p>
//             <strong>Email:</strong> {demoCredentials.email}
//           </p>
//           <p>
//             <strong>Password:</strong> {demoCredentials.password}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }
