import { calculateXirr } from './xirr.ts'

export const calculateInvestedAmount = (amounts: number[]): number =>
  amounts.filter(Number.isFinite).reduce((sum, value) => sum + value, 0)

export const calculateCurrentValue = (units: number, currentNav: number): number =>
  Math.max(0, units) * Math.max(0, currentNav)

export const calculateGainLoss = (currentValue: number, investedAmount: number): number =>
  currentValue - investedAmount

export const calculateAbsoluteReturn = (
  gainLoss: number,
  investedAmount: number,
): number => (investedAmount === 0 ? 0 : (gainLoss / investedAmount) * 100)

export const calculateInvestorXirr = (
  cashflows: Array<{ date: string; amount: number }>,
): number | null => calculateXirr(cashflows)
