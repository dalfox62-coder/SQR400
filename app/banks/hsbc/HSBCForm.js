"use client";

import { useState } from "react";

const HSBCForm = ({ onSubmit, initialData = {} }) => {
  const [showTechnical, setShowTechnical] = useState(false);
  const [formData, setFormData] = useState({
    institution: {
      swiftCode: initialData.institution?.swiftCode || "HBUKGB4B",
      accountNumber: initialData.institution?.accountNumber || "GB32HBUK40086810148040",
      accountName: initialData.institution?.accountName || "XA FINANCIAL LTD",
      bankName: initialData.institution?.bankName || "HSBC UK BANK PLC",
      address: initialData.institution?.address || "AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK",
    },
    transaction: {
      senderReference: initialData.transaction?.senderReference || "HSBC587069248914",
      transactionCode: initialData.transaction?.transactionCode || "HBUKGB4B248914",
      bankOperationCode: initialData.transaction?.bankOperationCode || "CRED",
      valueDate: initialData.transaction?.valueDate || "2024-10-25",
      transactionTime: initialData.transaction?.transactionTime || "15:30:30",
      currency: initialData.transaction?.currency || "EUR",
      amount: initialData.transaction?.amount || "3500000",
      instructedAmount: initialData.transaction?.instructedAmount || "3500000",
      remittanceInfo: initialData.transaction?.remittanceInfo || "INVESTMENT",
      charges: initialData.transaction?.charges || "OUR",
    },
    receiverBank: {
      bankName: initialData.receiverBank?.bankName || "BANK NEGARA INDONESIA - PT (PERSERO)",
      swiftCode: initialData.receiverBank?.swiftCode || "BNINIDJAXXX",
      address: initialData.receiverBank?.address || "BNI BUILDING, FLOOR 7, JALAN JENDERAL SUDIRMAN 1, JAKARTA, INDONESIA",
    },
    beneficiary: {
      swiftCode: initialData.beneficiary?.swiftCode || "BNINIDJAXXX",
      accountNumber: initialData.beneficiary?.accountNumber || "8980888829",
      accountName: initialData.beneficiary?.accountName || "PT ALDO PUTRA MANDIRI BANDUNG",
      bankName: initialData.beneficiary?.bankName || "BANK NEGARA INDONESIA - PT (PERSERO)",
      address: initialData.beneficiary?.address || "BNI BUILDING, JALAN ASIA AFRIKA, BANDUNG, INDONESIA",
    },
    technical: {
      srcRte: initialData.technical?.srcRte || "HBUKGB4BXXX",
      destRte: initialData.technical?.destRte || "BNINIDJAXXX",
      sessionHeader: initialData.technical?.sessionHeader || "HBUKGB4BXXX",
      msgInputRef: initialData.technical?.msgInputRef || "HBUKGB4BXXX75412835942185",
      msgOutputRef: initialData.technical?.msgOutputRef || "BNINIDJAXXX76102436987104",
      chk: initialData.technical?.chk || "HBUKGB4B2119809863",
      pkiSignature: initialData.technical?.pkiSignature || "MAC-EQUIVALENT",
      trackCode: initialData.technical?.trackCode || "",
      cipher: initialData.technical?.cipher || "",
      transmissionCode: initialData.technical?.transmissionCode || "",
    },
  });

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
      bankId: "hsbc",
      selectedBank: "HSBC UK",
      transactionDate: new Date().toLocaleString(),
      generatedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Header HSBC */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">HSBC</div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">HSBC UK Transfer</h2>
          <p className="text-xs text-gray-500">MT103 Single Customer Cash Transfer</p>
        </div>
      </div>

      {/* SENDER (INSTITUTION) DETAILS */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">🏛️</span> SENDER (INSTITUTION) DETAILS
        </h3>
        <p className="text-xs text-gray-500 italic mb-4">F50A/F52A: Account with Institution / Sender Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Swift Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
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
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.institution.accountNumber}
              onChange={(e) => handleChange("institution", "accountNumber", e.target.value)}
              placeholder="e.g., GB32HBUK40086810148040"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Account Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.institution.accountName}
              onChange={(e) => handleChange("institution", "accountName", e.target.value)}
              placeholder="e.g., XA FINANCIAL LTD"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.institution.bankName}
              onChange={(e) => handleChange("institution", "bankName", e.target.value)}
              placeholder="e.g., HSBC UK BANK PLC"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.institution.address}
              onChange={(e) => handleChange("institution", "address", e.target.value)}
              placeholder="e.g., AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK"
            />
          </div>
        </div>
      </div>

      {/* RECEIVER BANK DETAILS */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">🏦</span> RECEIVER BANK DETAILS
        </h3>
        <p className="text-xs text-gray-500 italic mb-4">F57A: Receiver Institution / Correspondent Bank</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.receiverBank.bankName}
              onChange={(e) => handleChange("receiverBank", "bankName", e.target.value)}
              placeholder="e.g., BANK NEGARA INDONESIA - PT (PERSERO)"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Swift Code</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.receiverBank.swiftCode}
              onChange={(e) => handleChange("receiverBank", "swiftCode", e.target.value)}
              placeholder="e.g., BNINIDJAXXX"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.receiverBank.address}
              onChange={(e) => handleChange("receiverBank", "address", e.target.value)}
              placeholder="e.g., BNI BUILDING, FLOOR 7, JALAN JENDERAL SUDIRMAN 1, JAKARTA, INDONESIA"
            />
          </div>
        </div>
      </div>

      {/* BENEFICIARY CUSTOMER DETAILS */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">👤</span> BENEFICIARY CUSTOMER DETAILS
        </h3>
        <p className="text-xs text-gray-500 italic mb-4">F59: Beneficiary Customer Name and Address</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.beneficiary.accountNumber}
              onChange={(e) => handleChange("beneficiary", "accountNumber", e.target.value)}
              placeholder="e.g., 8980888829"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.beneficiary.accountName}
              onChange={(e) => handleChange("beneficiary", "accountName", e.target.value)}
              placeholder="e.g., PT ALDO PUTRA MANDIRI BANDUNG"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Swift Code</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.beneficiary.swiftCode}
              onChange={(e) => handleChange("beneficiary", "swiftCode", e.target.value)}
              placeholder="e.g., BNINIDJAXXX"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.beneficiary.bankName}
              onChange={(e) => handleChange("beneficiary", "bankName", e.target.value)}
              placeholder="e.g., BANK NEGARA INDONESIA - PT (PERSERO)"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.beneficiary.address}
              onChange={(e) => handleChange("beneficiary", "address", e.target.value)}
              placeholder="e.g., BNI BUILDING, JALAN ASIA AFRIKA, BANDUNG, INDONESIA"
            />
          </div>
        </div>
      </div>

      {/* TRANSACTION DETAILS */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">📝</span> TRANSACTION DETAILS
        </h3>
        <p className="text-xs text-gray-500 italic mb-4">SWIFT Fields: F20, F21, F23B, F32A, F33B, F70, F71A, F77B</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">{"Sender's Reference (F20)"}</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.transaction.senderReference}
              onChange={(e) => handleChange("transaction", "senderReference", e.target.value)}
              placeholder="e.g., HSBC587069248914"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Transaction Code (F21)</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.transaction.transactionCode}
              onChange={(e) => handleChange("transaction", "transactionCode", e.target.value)}
              placeholder="e.g., HBUKGB4B248914"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Operation Code (F23B)</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black font-medium"
              value={formData.transaction.bankOperationCode}
              onChange={(e) => handleChange("transaction", "bankOperationCode", e.target.value)}
            >
              <option value="CRED">CRED - Credit</option>
              <option value="DEBT">DEBT - Debt</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Value Date</label>
              <input
                type="date"
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
                value={formData.transaction.valueDate}
                onChange={(e) => handleChange("transaction", "valueDate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Tx Time</label>
              <input
                type="text"
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
                value={formData.transaction.transactionTime}
                onChange={(e) => handleChange("transaction", "transactionTime", e.target.value)}
                placeholder="HH:MM:SS"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Currency</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black font-medium"
              value={formData.transaction.currency}
              onChange={(e) => handleChange("transaction", "currency", e.target.value)}
            >
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="SGD">SGD - Singapore Dollar</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
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
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.transaction.instructedAmount}
              onChange={(e) => handleChange("transaction", "instructedAmount", e.target.value)}
              placeholder="e.g., 3500000"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Details of Charges (F71A)</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black font-medium"
              value={formData.transaction.charges}
              onChange={(e) => handleChange("transaction", "charges", e.target.value)}
            >
              <option value="OUR">OUR - Sender pays all</option>
              <option value="BEN">BEN - Beneficiary pays all</option>
              <option value="SHA">SHA - Shared charges</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Remittance Information (F70)</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white text-sm text-black"
              value={formData.transaction.remittanceInfo}
              onChange={(e) => handleChange("transaction", "remittanceInfo", e.target.value)}
              placeholder="e.g., INVESTMENT"
            />
          </div>
        </div>
      </div>

      {/* TECHNICAL / SWIFT CONFIGS (COLLAPSIBLE) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6 transition-all">
        <button
          type="button"
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full flex justify-between items-center text-base font-bold text-gray-800 focus:outline-none"
        >
          <span className="flex items-center gap-2">⚙️ TECHNICAL / SWIFT ROUTING INFO</span>
          <span className="text-gray-500 text-sm">{showTechnical ? "Hide ▲" : "Show ▼"}</span>
        </button>

        {showTechnical && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Source Route (SRC RTE)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.srcRte}
                onChange={(e) => handleChange("technical", "srcRte", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Destination Route (DEST RTE)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.destRte}
                onChange={(e) => handleChange("technical", "destRte", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Session Header</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.sessionHeader}
                onChange={(e) => handleChange("technical", "sessionHeader", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Message Input Reference</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.msgInputRef}
                onChange={(e) => handleChange("technical", "msgInputRef", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Message Output Reference</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.msgOutputRef}
                onChange={(e) => handleChange("technical", "msgOutputRef", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Checksum (CHK)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.chk}
                onChange={(e) => handleChange("technical", "chk", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">PKI Signature</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.pkiSignature}
                onChange={(e) => handleChange("technical", "pkiSignature", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Page 2 Track Code (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.trackCode}
                onChange={(e) => handleChange("technical", "trackCode", e.target.value)}
                placeholder="Auto-generated if blank"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Page 2 Cipher (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.cipher}
                onChange={(e) => handleChange("technical", "cipher", e.target.value)}
                placeholder="Auto-generated if blank"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Page 2 Transmission Code (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white text-xs text-black font-mono"
                value={formData.technical.transmissionCode}
                onChange={(e) => handleChange("technical", "transmissionCode", e.target.value)}
                placeholder="Auto-generated if blank"
              />
            </div>
          </div>
        )}
      </div>

      {/* NOTICE */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-6">
        <p className="font-bold text-amber-800 text-sm">⚠️ IMPORTANT NOTICE</p>
        <p className="text-amber-700 text-sm mt-1">Please review all values carefully. The fields are pre-populated with standard SWIFT configuration values to match the approved PDF template.</p>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg transform hover:scale-[1.01]"
      >
        🚀 GENERATE HSBC MT103 TRANSACTION
      </button>

      <div className="text-center mt-4 text-gray-400 text-xs tracking-widest">sqr400web.com</div>
    </form>
  );
};

export default HSBCForm;
