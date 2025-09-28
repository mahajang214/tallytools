import React, { useState } from "react";

function Depreciation() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(null);
  const [depreciation, setDepreciation] = useState(null);
  const [product, setProduct] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [depreciationPercentage, setDepreciationPercentage] = useState("");
  const [currentPriceOfProduct, setCurrentPriceOfProduct] = useState(null);

  // Normalize input (replace . or - with /)
  const normalizeInput = (value) => value.replace(/[.\-]/g, "/");

  // Input handlers
  const handleStartChange = (e) => setStartDate(normalizeInput(e.target.value));
  const handleEndChange = (e) => setEndDate(normalizeInput(e.target.value));
  const handleProductChange = (e) => setProduct(e.target.value);
  const handleProductPriceChange = (e) => setProductPrice(e.target.value);

  const handleDepreciationPercentageChange = (e) => {
    let val = e.target.value;
    if (val.endsWith("%")) {
      val = val.slice(0, -1); // Remove % for numeric storage
    }
    setDepreciationPercentage(val);
  };

  const handleDepreciationInputBlur = () => {
    // Add % automatically if not present
    if (
      depreciationPercentage &&
      !depreciationPercentage.toString().endsWith("%")
    ) {
      setDepreciationPercentage(depreciationPercentage + "%");
    }
  };

  const parseDate = (dateStr) => {
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
    const year = parseInt(parts[2], 10);

    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day < 1 ||
      month < 0 ||
      month > 11
    ) {
      return null;
    }

    return new Date(Date.UTC(year, month, day)); // UTC for accurate day diff
  };

  const calculateDaysAndDepreciation = () => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end) {
      setDays("⚠️ Please enter valid dates in dd/mm/yyyy format");
      setDepreciation(null);
      return;
    }

    if (end < start) {
      setDays("⚠️ End date cannot be earlier than start date");
      setDepreciation(null);
      return;
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const diffDays =
      Math.round(
        (Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()) -
          Date.UTC(
            start.getUTCFullYear(),
            start.getUTCMonth(),
            start.getUTCDate()
          )) /
          oneDay
      ) + 1;

    setDays(diffDays);

    // Calculate depreciation
    if (
      productPrice &&
      !isNaN(productPrice) &&
      depreciationPercentage &&
      !isNaN(parseFloat(depreciationPercentage))
    ) {
      const dailyDep =
        (Number(productPrice) * parseFloat(depreciationPercentage)) / 100 / 365;
      let totalDepreciation = dailyDep * diffDays;

      // Round up if decimal part > 0.50
      const decimalPart = totalDepreciation % 1;
      if (decimalPart > 0.5) {
        totalDepreciation = Math.ceil(totalDepreciation);
      } else {
        totalDepreciation = totalDepreciation.toFixed(2); // keep 2 decimals if <= 0.50
      }

      setDepreciation(totalDepreciation);
      setCurrentPriceOfProduct(productPrice - totalDepreciation);
    } else {
      setDepreciation(null);
    }
  };

  return (
    <div className="text-gray-200 space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-sm mb-1">Product Name</label>
        <input
          type="text"
          placeholder="e.g. Laptop"
          value={product}
          onChange={handleProductChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product Price */}
      <div>
        <label className="block text-sm mb-1">Product Price</label>
        <input
          type="number"
          placeholder="e.g. 1000"
          value={productPrice}
          onChange={handleProductPriceChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Depreciation Percentage */}
      <div>
        <label className="block text-sm mb-1">Depreciation % (per year)</label>
        <input
          type="text"
          placeholder="e.g. 10%"
          value={depreciationPercentage}
          onChange={handleDepreciationPercentageChange}
          onBlur={handleDepreciationInputBlur}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm mb-1">Start Date (dd/mm/yyyy)</label>
        <input
          type="text"
          placeholder="e.g. 05/11/2025"
          value={startDate}
          onChange={handleStartChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm mb-1">End Date (dd/mm/yyyy)</label>
        <input
          type="text"
          placeholder="e.g. 30/01/2026"
          value={endDate}
          onChange={handleEndChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Button */}
      <button
        onClick={calculateDaysAndDepreciation}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
      >
        Calculate
      </button>

      {/* Results */}
      {days !== null && (
        <div className="mt-4 text-center text-lg font-semibold text-yellow-300">
          ✅ Total Days: {days}
        </div>
      )}

      {currentPriceOfProduct !== null && (
        <div className="text-center text-lg font-semibold text-green-400">
          💰 Current Price of {product}: ₹{Number(currentPriceOfProduct).toLocaleString("en-IN")}
        </div>
      )}

      {depreciation !== null && (
        <div className="text-center text-lg font-semibold text-green-400">
          💰 Total Depreciation: ₹{Number(depreciation).toLocaleString("en-IN")}
          
        </div>
      )}
    </div>
  );
}

export default Depreciation;
