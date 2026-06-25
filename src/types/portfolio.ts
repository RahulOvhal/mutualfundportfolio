export interface Transaction {
  id: string
  folioNumber: string
  schemeCode: string
  type: 'BUY' | 'SELL' | 'DIVIDEND'
  date: string
  units: number
  nav: number
  amount: number
}

export interface Scheme {
  schemeCode: string
  schemeName: string
  currentNav: number
}

export interface Folio {
  folioNumber: string
  investorId: string
  schemeCode: string
  pan: string
}

export interface Investor {
  id: string
  name: string
  pan: string
  email: string
}

export interface PortfolioFile {
  investors: Investor[]
  folios: Folio[]
  schemes: Scheme[]
  transactions: Transaction[]
}
