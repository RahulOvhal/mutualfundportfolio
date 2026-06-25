import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from "@reduxjs/toolkit";
import portfolioData from '../../data/portfolio.json'
import type { PortfolioFile } from '../../types/portfolio'
import type { Transaction } from "../../types/portfolio";
import { calculateXirr } from '../../utils/xirr'

interface SchemeHolding {
  schemeCode: string
  schemeName: string
  folioNumber: string
  unitsHeld: number
  averageNav: number
  currentNav: number
  investedAmount: number
  currentValue: number
  gainLoss: number
  returnPercent: number
  xirr: number | null
}

export interface InvestorSummary {
  id: string
  name: string
  pan: string
  folioCount: number
  investedAmount: number
  currentValue: number
  gainLoss: number
  xirr: number | null
}

interface PortfolioState {
  investors: InvestorSummary[]
  holdings: Record<string, SchemeHolding[]>
  selectedInvestorId: string | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: PortfolioState = {
  investors: [],
  holdings: {},
  selectedInvestorId: null,
  status: 'idle',
  error: null,
}

const normalizeTransactions = (transactions: Transaction[]): Transaction[] => {
  const transactionMap = new Map<string, Transaction>()

  return transactions
    .filter((txn) => txn.folioNumber && txn.schemeCode && txn.date && txn.type)
    .filter((txn) => txn.units >= 0 && txn.nav >= 0 && txn.amount >= 0)
    .filter((txn) => {
      const key = `${txn.folioNumber}-${txn.schemeCode}-${txn.date}-${txn.type}-${txn.amount}`
      if (transactionMap.has(key)) {
        return false
      }
      transactionMap.set(key, txn)
      return true
    })
}

const buildInvestorSummary = (
  investor: PortfolioFile['investors'][number],
  folios: PortfolioFile['folios'],
  schemes: PortfolioFile['schemes'],
  transactions: Transaction[],
): InvestorSummary => {
  const investorFolios = folios.filter((folio) => folio.investorId === investor.id)
  const folioCount = investorFolios.length
  const schemeHoldings = investorFolios.map((folio) => {
    const scheme = schemes.find((item) => item.schemeCode === folio.schemeCode)
    const related = transactions.filter((txn) => txn.folioNumber === folio.folioNumber)
    const unitsHeld = related.reduce((sum, txn) => sum + (txn.type === 'BUY' ? txn.units : 0 - txn.units), 0)
    const investedAmount = related
      .filter((txn) => txn.type === 'BUY')
      .reduce((sum, txn) => sum + txn.amount, 0)
    const currentNav = scheme?.currentNav ?? 0
    const currentValue = unitsHeld * currentNav
    const gainLoss = currentValue - investedAmount
    const xirr = calculateXirr(
      related.map((txn) => ({ date: txn.date, amount: txn.type === 'BUY' ? -txn.amount : txn.amount })),
    )
    return {
      schemeCode: folio.schemeCode,
      schemeName: scheme?.schemeName ?? 'Unknown Scheme',
      folioNumber: folio.folioNumber,
      unitsHeld,
      averageNav: investedAmount > 0 ? investedAmount / Math.max(unitsHeld, 1) : 0,
      currentNav,
      investedAmount,
      currentValue,
      gainLoss,
      returnPercent: investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0,
      xirr,
    }
  })

  const investedAmount = schemeHoldings.reduce((sum, item) => sum + item.investedAmount, 0)
  const currentValue = schemeHoldings.reduce((sum, item) => sum + item.currentValue, 0)
  const gainLoss = currentValue - investedAmount
  const xirr = calculateXirr(
    schemeHoldings.flatMap((item) =>
      transactions
        .filter((txn) => txn.folioNumber.startsWith(item.folioNumber))
        .map((txn) => ({ date: txn.date, amount: txn.type === 'BUY' ? -txn.amount : txn.amount })),
    ),
  )

  return {
    id: investor.id,
    name: investor.name,
    pan: investor.pan,
    folioCount,
    investedAmount,
    currentValue,
    gainLoss,
    xirr,
  }
}

export const loadPortfolio = createAsyncThunk('portfolio/load', async () => {
  const data = portfolioData as PortfolioFile
  const transactions = normalizeTransactions(data.transactions)
  const investors = data.investors.map((investor) =>
    buildInvestorSummary(investor, data.folios, data.schemes, transactions),
  )

  const holdings = data.investors.reduce<Record<string, SchemeHolding[]>>((acc, investor) => {
    const investorFolios = data.folios.filter((folio) => folio.investorId === investor.id)
    acc[investor.id] = investorFolios.map((folio) => {
      const scheme = data.schemes.find((item) => item.schemeCode === folio.schemeCode)
      const related = transactions.filter((txn) => txn.folioNumber === folio.folioNumber)
      const unitsHeld = related.reduce((sum, txn) => sum + (txn.type === 'BUY' ? txn.units : 0 - txn.units), 0)
      const investedAmount = related
        .filter((txn) => txn.type === 'BUY')
        .reduce((sum, txn) => sum + txn.amount, 0)
      const currentNav = scheme?.currentNav ?? 0
      const currentValue = unitsHeld * currentNav
      const gainLoss = currentValue - investedAmount
      const xirr = calculateXirr(
        related.map((txn) => ({ date: txn.date, amount: txn.type === 'BUY' ? -txn.amount : txn.amount })),
      )
      return {
        schemeCode: folio.schemeCode,
        schemeName: scheme?.schemeName ?? 'Unknown Scheme',
        folioNumber: folio.folioNumber,
        unitsHeld,
        averageNav: investedAmount > 0 ? investedAmount / Math.max(unitsHeld, 1) : 0,
        currentNav,
        investedAmount,
        currentValue,
        gainLoss,
        returnPercent: investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0,
        xirr,
      }
    })
    return acc
  }, {})

  return { investors, holdings }
})

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setSelectedInvestor(state, action: PayloadAction<string | null>) {
      state.selectedInvestorId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPortfolio.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadPortfolio.fulfilled, (state, action) => {
        state.status = 'idle'
        state.investors = action.payload.investors
        state.holdings = action.payload.holdings
        state.error = null
      })
      .addCase(loadPortfolio.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unable to load portfolio data'
      })
  },
})

export const { setSelectedInvestor } = portfolioSlice.actions
export default portfolioSlice.reducer
