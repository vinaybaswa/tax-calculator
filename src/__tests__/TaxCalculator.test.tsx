import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaxCalculator from "../components/TaxCalculator";
import { fetchTaxBrackets } from "../services/taxService";

// Mock the tax service
vi.mock("../services/taxService", () => ({
  fetchTaxBrackets: vi.fn(),
  calculateTax: vi.fn().mockImplementation((income, brackets) => ({
    totalTax: 15000,
    effectiveRate: 0.15,
    bracketTaxes: [
      {
        bracket: brackets[0],
        taxAmount: 15000,
      },
    ],
  })),
}));

describe("TaxCalculator", () => {
  it("renders the calculator form", () => {
    render(<TaxCalculator />);
    expect(screen.getByLabelText(/annual income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tax year/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /calculate tax/i })
    ).toBeInTheDocument();
  });

  it("validates income input", async () => {
    render(<TaxCalculator />);

    const incomeInput = screen.getByLabelText(/annual income/i);
    const submitButton = screen.getByRole("button", { name: /calculate tax/i });

    await userEvent.type(incomeInput, "-1000");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid income amount/i)
      ).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    (fetchTaxBrackets as any).mockRejectedValueOnce(
      new Error("INTERNAL SERVER ERROR")
    );

    render(<TaxCalculator />);

    const incomeInput = screen.getByLabelText(/annual income/i);
    const submitButton = screen.getByRole("button", { name: /calculate tax/i });

    await userEvent.type(incomeInput, "100000");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred, Try again/i)
      ).toBeInTheDocument();
    });
  });

  it("handles form submission with valid data", async () => {
    const mockTaxBrackets = {
      tax_brackets: [{ min: 0, max: 50000, rate: 0.15 }],
    };

    (fetchTaxBrackets as any).mockResolvedValueOnce(mockTaxBrackets);

    render(<TaxCalculator />);

    const incomeInput = screen.getByLabelText(/annual income/i);
    const yearSelect = screen.getByLabelText(/tax year/i);
    const submitButton = screen.getByRole("button", { name: /calculate tax/i });

    await userEvent.type(incomeInput, "100000");
    await userEvent.selectOptions(yearSelect, "2022");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/total tax/i)).toBeInTheDocument();
      expect(screen.getByText(/Breakdown by Tax Bracket/i)).toBeInTheDocument();
    });
  });
});
