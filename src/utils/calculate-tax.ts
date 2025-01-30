import { TaxBracket, TaxCalculated } from "../types/tax-types";

const calculateTax = (
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

  export default calculateTax;