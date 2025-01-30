const TaxCalculator = () => {
  return (
    <div>
      <div>
        <h1>Tax Calculator</h1>
      </div>

      <form>
        <div>
          <label htmlFor="income">Annual Income ($)</label>
          <input
            type="number"
            id="income"
            value="120000"
            onChange={() => {}}
            placeholder="Enter your annual income"
            required
          />
        </div>

        <div>
          <label htmlFor="year">Tax Year</label>
          <select id="year" value="2022" onChange={() => {}} required>
            <option key="2019" value="2019">
              2019
            </option>
            <option key="2020" value="2020">
              2020
            </option>
            <option key="2021" value="2021">
              2021
            </option>
            <option key="2022" value="2022">
              2022
            </option>
          </select>
        </div>

        <button type="submit">Calculate Tax</button>
      </form>
    </div>
  );
};

export default TaxCalculator;
