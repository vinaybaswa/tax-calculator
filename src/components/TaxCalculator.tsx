import { useState } from "react";

import { TaxCalculated } from "../types/tax-types";

import calculateTax from "../utils/calculate-tax";

const SUPPORTED_YEARS = [2019, 2020, 2021, 2022];
const BASE_URL = "http://localhost:5001/tax-calculator";

const TaxCalculator = () => {
  const [income, setIncome] = useState<string>("");
  const [year, setYear] = useState<string>("2022");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaxCalculated | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const incomeNum = parseFloat(income);
      if (isNaN(incomeNum) || incomeNum < 0) {
        throw new Error("Please enter a valid income amount");
      }

      const { tax_brackets } = await fetch(`${BASE_URL}/tax-year/${year}`).then(
        (res) => res.json()
      );

      setResult(calculateTax(incomeNum, tax_brackets));
      calculateTax(incomeNum, tax_brackets);
      console.log(result);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Tax Calculator</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="income">Annual Income ($)</label>
          <input
            type="number"
            id="income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your annual income"
            required
          />
        </div>

        <div>
          <label htmlFor="year">Tax Year</label>
          <select
            id="year"
            value="2022"
            onChange={(e) => setYear(e.target.value)}
            required
          >
            {SUPPORTED_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button disabled={loading} type="submit">
          {loading ? "Calculating..." : "Calculate Tax"}
        </button>
      </form>

      {result && (
        <div>
          <div>
            <h2>Calculated Tax</h2>

            <div>
              <div>
                <span>Total Tax:</span>
                <span>${result.totalTax.toFixed(2)}</span>
              </div>

              <div>
                <span>Effective Tax Rate:</span>
                <span>{(result.effectiveRate * 100).toFixed(2)}%</span>
              </div>

              <div>
                <h3>Breakdown by Tax Bracket</h3>
                <div>
                  {result.bracketTaxes.map((bracketTax, index) => (
                    <div key={index}>
                      <span>
                        ${bracketTax.bracket.min.toLocaleString()} -
                        {bracketTax.bracket.max
                          ? `$${bracketTax.bracket.max.toLocaleString()}`
                          : "and up"}
                        ({(bracketTax.bracket.rate * 100).toFixed(1)}%):
                      </span>
                      <span>${bracketTax.taxAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalculator;
