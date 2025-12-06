export type Language = 'it' | 'en';

export interface SimulationParams {
  dailyAmount: number;
  interestRate: number;
  startAge: number;
  investmentDurationYears: number;
  targetAge: number;
}

export interface YearData {
  age: number;
  year: number;
  totalPrincipal: number; // Money put in pocket
  totalInterest: number;  // Money earned
  totalValue: number;     // Sum
  isContributing: boolean;
}

export interface SimulationResult {
  finalAmount: number;
  totalInvested: number;
  totalInterestEarned: number;
  data: YearData[];
}