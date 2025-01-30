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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-center mb-8">
            <h1 className="ml-3 text-3xl font-bold text-gray-900">
              Tax Calculator
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="income"
                className="block text-sm font-medium text-gray-700"
              >
                Annual Income ($)
              </label>
              <input
                type="number"
                id="income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your annual income"
                required
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Tax Year
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {SUPPORTED_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black opacity-100 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Calculating..." : "Calculate Tax"}
            </button>
          </form>

          {result && (
            <div className="mt-8 space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Tax Calculation Results
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Tax:</span>
                    <span className="text-lg font-semibold">
                      ${result.totalTax.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Effective Tax Rate:</span>
                    <span className="text-lg font-semibold">
                      {(result.effectiveRate * 100).toFixed(2)}%
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Breakdown by Tax Bracket
                    </h3>
                    <div className="space-y-3">
                      {result.bracketTaxes.map((bracketTax, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600">
                            ${bracketTax.bracket.min.toLocaleString()} -
                            {bracketTax.bracket.max
                              ? `$${bracketTax.bracket.max.toLocaleString()}`
                              : "and up"}
                            ({(bracketTax.bracket.rate * 100).toFixed(1)}%):
                          </span>
                          <span className="font-medium">
                            ${bracketTax.taxAmount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
