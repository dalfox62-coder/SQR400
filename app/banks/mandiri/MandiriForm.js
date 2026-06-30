"use client";
import { useState } from "react";
const MandiriForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    institution: { swiftCode: "BMRIIDJA", accountNumber: "1234567890", accountName: "PT MANDIRI TEST", bankName: "PT BANK MANDIRI TBK", address: "JALAN GATOT SUBROTO, JAKARTA" },
    transaction: {
      senderReference: "MANDIRI001",
      transactionCode: "BMRIIDJA001",
      bankOperationCode: "CRED",
      valueDate: "",
      currency: "IDR",
      amount: "1000000000",
      instructedAmount: "1000000000",
      remittanceInfo: "INVESTMENT",
      charges: "OUR",
    },
    beneficiary: { swiftCode: "BNINIDJA", accountNumber: "987654321", accountName: "PT BENEFICIARY MANDIRI", bankName: "BANK NEGARA INDONESIA", address: "JAKARTA" },
    sender: { bankName: "BANK MANDIRI", senderServer: "BMRIIDJAXXX", instrument: "MT103" },
  });
  const handleChange = (section, field, value) => setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, bankId: "mandiri", selectedBank: "Bank Mandiri", transactionDate: new Date().toLocaleString(), generatedAt: new Date().toISOString() });
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">Mandiri</div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Bank Mandiri Transfer</h2>
          <p className="text-xs text-gray-500">MT103 Single Customer Cash Transfer</p>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <span className="text-xl">🏛️</span> INSTITUTION DETAILS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Swift Code *</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.swiftCode}
              onChange={(e) => handleChange("institution", "swiftCode", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Account Number</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.accountNumber}
              onChange={(e) => handleChange("institution", "accountNumber", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Account Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.accountName}
              onChange={(e) => handleChange("institution", "accountName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Bank Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.bankName}
              onChange={(e) => handleChange("institution", "bankName", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.address}
              onChange={(e) => handleChange("institution", "address", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-6">
        <p className="font-bold text-amber-800 text-sm">⚠️ IMPORTANT NOTICE</p>
        <p className="text-amber-700 text-sm mt-1">Please review your information carefully before continuing.</p>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
      >
        🚀 GENERATE MANDIRI MT103
      </button>
      <div className="text-center mt-4 text-gray-400 text-xs tracking-widest">sqr400web.com</div>
    </form>
  );
};
export default MandiriForm;
