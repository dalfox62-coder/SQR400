"use client";

import { useState } from "react";

const BNIForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    institution: {
      swiftCode: initialData.institution?.swiftCode || "BNINIDJA",
      accountNumber: initialData.institution?.accountNumber || "1909861020",
      accountName: initialData.institution?.accountName || "YAYASAN PERLINDUNGAN KONSUMEN",
      bankName: initialData.institution?.bankName || "PT BANK NEGARA INDONESIA TBK",
      address: initialData.institution?.address || "BNI BUILDING, JALAN JENDERAL SUDIRMAN, JAKARTA",
    },
    transaction: {
      senderReference: initialData.transaction?.senderReference || "820F60418E0490C",
      transactionCode: initialData.transaction?.transactionCode || "BNINIDJA248914",
      bankOperationCode: initialData.transaction?.bankOperationCode || "SPRI",
      valueDate: initialData.transaction?.valueDate || "",
      currency: initialData.transaction?.currency || "EUR",
      amount: initialData.transaction?.amount || "49000000",
      instructedAmount: initialData.transaction?.instructedAmount || "49000000",
      remittanceInfo: initialData.transaction?.remittanceInfo || "INVESTMENT",
      charges: initialData.transaction?.charges || "OUR",
    },
    beneficiary: {
      swiftCode: initialData.beneficiary?.swiftCode || "BNINIDJAKDI",
      accountNumber: initialData.beneficiary?.accountNumber || "1909861020",
      accountName: initialData.beneficiary?.accountName || "YAYASAN PERLINDUNGAN KONSUMEN RAKYAT INDONESIA",
      bankName: initialData.beneficiary?.bankName || "PT BANK NEGARA INDONESIA TBK",
      address: initialData.beneficiary?.address || "KCU KEDIRI, JL. BRAWIJAYA NO. 17, JAWA TIMUR",
    },
    sender: {
      bankName: initialData.sender?.bankName || "DEUTSCHE BANK AG",
      senderServer: initialData.sender?.senderServer || "DEUTDEBBXXX",
      instrument: initialData.sender?.instrument || "MT103",
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
      bankId: "bni",
      selectedBank: "BNI Indonesia",
      transactionDate: new Date().toLocaleString(),
      generatedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Header BNI */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">BNI</div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">BNI Indonesia Transfer</h2>
          <p className="text-xs text-gray-500">MT103 Single Customer Cash Transfer</p>
        </div>
      </div>

      {/* INSTITUTION DETAILS */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">🏛️</span> INSTITUTION DETAILS
        </h3>
        <p className="text-xs text-gray-500 italic mb-4">F53A: Account with Institution-BIC / Corresponding Bank</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Swift Code *</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.swiftCode}
              onChange={(e) => handleChange("institution", "swiftCode", e.target.value)}
              placeholder="e.g., BNINIDJA"
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
              placeholder="e.g., 1909861020"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Account Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.accountName}
              onChange={(e) => handleChange("institution", "accountName", e.target.value)}
              placeholder="e.g., YAYASAN PERLINDUNGAN KONSUMEN"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.bankName}
              onChange={(e) => handleChange("institution", "bankName", e.target.value)}
              placeholder="e.g., PT BANK NEGARA INDONESIA TBK"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.address}
              onChange={(e) => handleChange("institution", "address", e.target.value)}
              placeholder="e.g., BNI BUILDING, JALAN JENDERAL SUDIRMAN, JAKARTA"
            />
          </div>
        </div>
      </div>

      {/* TRANSACTION DETAILS - shortened for demo */}
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
              placeholder="e.g., 820F60418E0490C"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Currency</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.currency}
              onChange={(e) => handleChange("transaction", "currency", e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="IDR">IDR</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Amount *</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.amount}
              onChange={(e) => handleChange("transaction", "amount", e.target.value)}
              placeholder="e.g., 49000000"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Remittance Info</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.remittanceInfo}
              onChange={(e) => handleChange("transaction", "remittanceInfo", e.target.value)}
              placeholder="e.g., INVESTMENT"
            />
          </div>
        </div>
      </div>

      {/* BENEFICIARY INFORMATION - shortened for demo */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">👤</span> BENEFICIARY INFORMATION
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Swift Code *</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.beneficiary.swiftCode}
              onChange={(e) => handleChange("beneficiary", "swiftCode", e.target.value)}
              placeholder="e.g., BNINIDJAKDI"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Account Number *</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.beneficiary.accountNumber}
              onChange={(e) => handleChange("beneficiary", "accountNumber", e.target.value)}
              placeholder="e.g., 1909861020"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Account Name *</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.beneficiary.accountName}
              onChange={(e) => handleChange("beneficiary", "accountName", e.target.value)}
              placeholder="e.g., YAYASAN PERLINDUNGAN KONSUMEN RAKYAT INDONESIA"
              required
            />
          </div>
        </div>
      </div>

      {/* NOTICE */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-6">
        <p className="font-bold text-amber-800 text-sm">⚠️ IMPORTANT NOTICE</p>
        <p className="text-amber-700 text-sm mt-1">Please review your information carefully before continuing.</p>
      </div>

      {/* SUBMIT */}
      <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg">
        🚀 GENERATE BNI MT103 TRANSACTION
      </button>

      <div className="text-center mt-4 text-gray-400 text-xs tracking-widest">sqr400web.com</div>
    </form>
  );
};

export default BNIForm;
