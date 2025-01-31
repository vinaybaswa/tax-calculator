import { FC } from "react";
import { TaxCalculated } from "../types/taxTypes";

const Result: FC<{ result: TaxCalculated }> = ({ result }) => {
  return (
    <div className="mt-8 space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Calculated Tax
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200">
            <span className="text-gray-600">Total Tax:</span>
            <span className="text-lg font-semibold">
              ${result.totalTax.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200">
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
                  className="flex justify-between items-center text-sm border-b border-gray-200"
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
  );
};

export default Result;
