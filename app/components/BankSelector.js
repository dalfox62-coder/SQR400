"use client";

import { bankOptions } from "../utils/bankConfig";

const BankSelector = ({ selectedBank, onSelectBank }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">🏦 Select Bank:</label>
        <select
          className="w-full sm:w-auto px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm font-medium"
          value={selectedBank}
          onChange={(e) => onSelectBank(e.target.value)}
        >
          {bankOptions.map((bank) => (
            <option key={bank.id} value={bank.id}>
              {bank.name}
            </option>
          ))}
        </select>
        <div className="flex-1 text-right text-xs text-gray-400">
          Current: <span className="font-semibold text-gray-600">{bankOptions.find((b) => b.id === selectedBank)?.name || "HSBC UK"}</span>
        </div>
      </div>
    </div>
  );
};

export default BankSelector;
