import { SimulationParams, SimulationResult, YearData } from '../types';

export const calculateGrowth = (params: SimulationParams): SimulationResult => {
  const { dailyAmount, interestRate, startAge, investmentDurationYears, targetAge } = params;
  
  const annualContribution = dailyAmount * 365;
  const rateDecimal = interestRate / 100;
  
  let currentBalance = 0;
  let totalInvested = 0;
  const data: YearData[] = [];
  
  const totalYears = targetAge - startAge;

  for (let i = 0; i <= totalYears; i++) {
    const currentAge = startAge + i;
    const isContributing = i < investmentDurationYears;

    // Apply interest first (assuming end of year contribution for simplicity in this model)
    // Or for more accuracy with daily input, we treat it as adding to the principal throughout the year.
    // A simple approximation: Balance * (1+r) + Contribution
    
    // Interest earned this year on previous balance
    const interestEarned = currentBalance * rateDecimal;
    
    let contributionThisYear = 0;
    if (isContributing) {
      contributionThisYear = annualContribution;
    }

    // Update totals
    // Logic: Interest is applied to the balance. 
    // New money is added (simplification: added at end of year so it doesn't earn interest in year 0)
    currentBalance = currentBalance + interestEarned + contributionThisYear;
    totalInvested += contributionThisYear;

    data.push({
      age: currentAge,
      year: i,
      totalPrincipal: totalInvested,
      totalInterest: currentBalance - totalInvested,
      totalValue: currentBalance,
      isContributing
    });
  }

  return {
    finalAmount: currentBalance,
    totalInvested,
    totalInterestEarned: currentBalance - totalInvested,
    data
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(val);
};