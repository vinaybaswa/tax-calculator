import { useState } from "react";

import { Calculator } from "lucide-react";

import Result from "./Result";
import Error from "./Error";

import { TaxCalculated } from "../types/taxTypes";
// import calculateTax from "../utils/calculateTax";
// import fetchTaxBrackets from "../utils/fetchTaxBrackets";
import { calculateTax, fetchTaxBrackets } from "../services/taxService";

const SUPPORTED_YEARS = [2019, 2020, 2021, 2022];
const BASE_URL = "http://localhost:5001/tax-calculator";

const TaxCalculator = () => {
  const [income, setIncome] = useState<string>("");
  const [year, setYear] = useState<string>("2022");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TaxCalculated | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const incomeNum = parseFloat(income);
      if (isNaN(incomeNum) || incomeNum < 0) {
        setError("Please enter a valid income amount");
        return;
      }

      const { tax_brackets } = await fetchTaxBrackets(parseInt(year));

      setResult(calculateTax(incomeNum, tax_brackets));
    } catch (error) {
      setError("An unexpected error occurred, Try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-center mb-8">
            <Calculator className="w-12 h-12" />
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

          {error && <Error error={error} />}

          {result && <Result result={result} />}
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
