export interface TaxBracket {
  min: number;
  max?: number;
  rate: number;
}

export interface TaxResponse {
  tax_brackets: TaxBracket[];
}

export interface TaxCalculated {
  totalTax: number;
  effectiveRate: number;
  bracketTaxes: {
    bracket: TaxBracket;
    taxAmount: number;
  }[];
}
