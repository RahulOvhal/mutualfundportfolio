export type CashFlow = { date: Date; amount: number }

const safeParseDate = (value: string): Date | null => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const daysBetween = (d1: Date, d2: Date): number =>
  (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)

const xnpv = (rate: number, cashflows: CashFlow[]): number =>
  cashflows.reduce((sum, flow) => {
    const days = daysBetween(cashflows[0].date, flow.date)
    return sum + flow.amount / Math.pow(1 + rate, days / 365)
  }, 0)

export const calculateXirr = (
  cashflows: Array<{ date: string; amount: number }>,
): number | null => {
  const parsed: CashFlow[] = cashflows
    .map((flow) => ({ date: safeParseDate(flow.date), amount: flow.amount }))
    .filter((flow): flow is CashFlow => flow.date !== null && Number.isFinite(flow.amount))

  if (parsed.length < 2) {
    return null
  }

  const hasPositive = parsed.some((flow) => flow.amount > 0)
  const hasNegative = parsed.some((flow) => flow.amount < 0)
  if (!hasPositive || !hasNegative) {
    return null
  }

  let rate = 0.1
  let iteration = 0

  while (iteration < 100) {
    const value = xnpv(rate, parsed)
    const derivative = (xnpv(rate + 1e-6, parsed) - value) / 1e-6
    if (Math.abs(derivative) < 1e-12) {
      break
    }
    const nextRate = rate - value / derivative
    if (Number.isNaN(nextRate) || !Number.isFinite(nextRate)) {
      break
    }
    if (Math.abs(nextRate - rate) < 1e-9) {
      rate = nextRate
      break
    }
    rate = nextRate
    iteration += 1
  }

  if (Number.isNaN(rate) || !Number.isFinite(rate)) {
    return null
  }

  return rate * 100
}
