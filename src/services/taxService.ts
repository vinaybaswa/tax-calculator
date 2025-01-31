import { TaxResponse } from "../types/taxTypes";

const BASE_URL = "http://localhost:5001/tax-calculator";

export const fetchTaxBrackets = async (year: number): Promise<TaxResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/tax-year/${year}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch tax brackets. Please try again.");
    throw error;
  }
};

import { TaxBracket, TaxCalculated } from "../types/taxTypes";

export const calculateTax = (
  income: number,
  brackets: TaxBracket[]
): TaxCalculated => {
  let totalTax = 0;
  const bracketTaxes: { bracket: TaxBracket; taxAmount: number }[] = [];

  brackets.forEach((bracket) => {
    const { min, rate } = bracket;
    const max = bracket.max ?? Infinity;

    let taxableAmount = 0;
    if (income > min) {
      taxableAmount = Math.min(income - min, max - min);
      const taxForBracket = taxableAmount * rate;
      totalTax += taxForBracket;
      bracketTaxes.push({
        bracket,
        taxAmount: taxForBracket,
      });
    }
  });

  return {
    totalTax,
    effectiveRate: totalTax / income || 0,
    bracketTaxes,
  };
};
