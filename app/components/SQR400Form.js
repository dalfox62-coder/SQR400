"use client";

import { useState } from "react";

const SQR400Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    institution: {
      swiftCode: "",
      accountNumber: "",
      accountName: "",
      bankName: "",
      address: "",
    },
    transaction: {
      senderReference: "",
      transactionCode: "",
      bankOperationCode: "CRED",
      valueDate: "",
      currency: "USD",
      amount: "",
      instructedAmount: "",
      remittanceInfo: "",
      charges: "OUR",
    },
    beneficiary: {
      swiftCode: "",
      accountNumber: "",
      accountName: "",
      bankName: "",
      address: "",
    },
    sender: {
      bankName: "",
      senderServer: "HBUKGB4BXXX",
      instrument: "MT103",
    },
  });

  const [selectedBank, setSelectedBank] = useState("HSBC UK");

  const bankOptions = ["HSBC UK", "BNI Indonesia", "Deutsche Bank", "Bank Mandiri", "BCA", "CitiBank", "Standard Chartered", "DBS Bank"];

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.institution.swiftCode || !formData.beneficiary.accountNumber) {
      alert("Please fill in required fields: Swift Code and Beneficiary Account Number");
      return;
    }

    onSubmit({
      ...formData,
      selectedBank,
      transactionDate: new Date().toLocaleString(),
      generatedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* INSTITUTION DETAILS */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">🏛️</span> INSTITUTION DETAILS
        </h3>
        <p className="text-xs text-gray-500 italic mb-4">F53A: Account with Institution-BIC / Corresponding Bank</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Swift Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.swiftCode}
              onChange={(e) => handleChange("institution", "swiftCode", e.target.value)}
              placeholder="e.g., HBUKGB4B"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Account Number</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.accountNumber}
              onChange={(e) => handleChange("institution", "accountNumber", e.target.value)}
              placeholder="e.g., GB32HBUK40086810148040"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Account Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.accountName}
              onChange={(e) => handleChange("institution", "accountName", e.target.value)}
              placeholder="e.g., XA FINANCIAL LTD"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.bankName}
              onChange={(e) => handleChange("institution", "bankName", e.target.value)}
              placeholder="e.g., HSBC UK BANK PLC"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.address}
              onChange={(e) => handleChange("institution", "address", e.target.value)}
              placeholder="e.g., 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK"
            />
          </div>
        </div>
      </div>

      {/* TRANSACTION DETAILS */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">📝</span> TRANSACTION DETAILS
        </h3>
        <p className="text-xs text-gray-500 italic mb-4">F70: Remittance Information / Purpose</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Sender's Reference (F20)</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.senderReference}
              onChange={(e) => handleChange("transaction", "senderReference", e.target.value)}
              placeholder="e.g., HSBC587069248914"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Transaction Code (F21)</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.transactionCode}
              onChange={(e) => handleChange("transaction", "transactionCode", e.target.value)}
              placeholder="e.g., HBUKGB4B248914"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Operation Code</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.bankOperationCode}
              onChange={(e) => handleChange("transaction", "bankOperationCode", e.target.value)}
            >
              <option value="CRED">CRED</option>
              <option value="DEBT">DEBT</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Value Date</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.valueDate}
              onChange={(e) => handleChange("transaction", "valueDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Currency</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.currency}
              onChange={(e) => handleChange("transaction", "currency", e.target.value)}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="SGD">SGD - Singapore Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.amount}
              onChange={(e) => handleChange("transaction", "amount", e.target.value)}
              placeholder="e.g., 3500000"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Instructed Amount</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.instructedAmount}
              onChange={(e) => handleChange("transaction", "instructedAmount", e.target.value)}
              placeholder="e.g., 3500000"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Remittance Information / Purpose (F70)</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.remittanceInfo}
              onChange={(e) => handleChange("transaction", "remittanceInfo", e.target.value)}
              placeholder="e.g., INVESTMENT / TRADE SETTLEMENT / PAYMENT"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Details of Charges (F71A)</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.charges}
              onChange={(e) => handleChange("transaction", "charges", e.target.value)}
            >
              <option value="OUR">OUR - Sender pays all</option>
              <option value="BEN">BEN - Beneficiary pays all</option>
              <option value="SHA">SHA - Shared charges</option>
            </select>
          </div>
        </div>
      </div>

      {/* BENEFICIARY INFORMATION */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">👤</span> BENEFICIARY INFORMATION
        </h3>
        <p className="text-xs text-gray-500 italic mb-4">F59A: Beneficiary (NY) Customer Name and Address</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Swift Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.beneficiary.swiftCode}
              onChange={(e) => handleChange("beneficiary", "swiftCode", e.target.value)}
              placeholder="e.g., BNINIDJAXXX"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.beneficiary.accountNumber}
              onChange={(e) => handleChange("beneficiary", "accountNumber", e.target.value)}
              placeholder="e.g., 898088829"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.beneficiary.accountName}
              onChange={(e) => handleChange("beneficiary", "accountName", e.target.value)}
              placeholder="e.g., PT ALDO PUTRA MANDIRI"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.beneficiary.bankName}
              onChange={(e) => handleChange("beneficiary", "bankName", e.target.value)}
              placeholder="e.g., BANK NEGARA INDONESIA"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.beneficiary.address}
              onChange={(e) => handleChange("beneficiary", "address", e.target.value)}
              placeholder="e.g., BNI BUILDING, JALAN ASIA AFRIKA, BANDUNG, INDONESIA"
            />
          </div>
        </div>
      </div>

      {/* SENDER INFORMATION */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <span className="text-xl">📤</span> SENDER INFORMATION
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Select Bank</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              {bankOptions.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.sender.bankName}
              onChange={(e) => handleChange("sender", "bankName", e.target.value)}
              placeholder="e.g., HSBC UK BANK PLC"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Sender Server</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.sender.senderServer}
              onChange={(e) => handleChange("sender", "senderServer", e.target.value)}
              placeholder="e.g., HBUKGB4BXXX"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Select Instrument</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.sender.instrument}
              onChange={(e) => handleChange("sender", "instrument", e.target.value)}
            >
              <option value="MT103">MT103 - Single Customer Credit Transfer</option>
              <option value="MT202">MT202 - General Financial Institution Transfer</option>
              <option value="MT199">MT199 - Free Format Message</option>
              <option value="MT300">MT300 - Foreign Exchange Confirmation</option>
            </select>
          </div>
        </div>
      </div>

      {/* NOTICE */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-6">
        <p className="font-bold text-amber-800 text-sm">⚠️ IMPORTANT NOTICE</p>
        <p className="text-amber-700 text-sm mt-1">Please review your information carefully before continuing. Incorrect or incomplete details can cause processing delays or prevent your transaction from going through.</p>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg transform hover:scale-[1.01]"
      >
        🚀 GENERATE MT103 TRANSACTION
      </button>

      <div className="text-center mt-4 text-gray-400 text-xs tracking-widest">sqr400web.com</div>
    </form>
  );
};

export default SQR400Form;
