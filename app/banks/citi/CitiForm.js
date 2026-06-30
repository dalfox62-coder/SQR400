"use client";
import { useState } from "react";
const CitiForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    institution: { swiftCode: "CITIIDJX", accountNumber: "123456789", accountName: "PT CITI TEST", bankName: "CITIBANK NA", address: "JALAN SUDIRMAN, JAKARTA" },
    transaction: { senderReference: "CITI001", transactionCode: "CITIIDJX001", bankOperationCode: "CRED", valueDate: "", currency: "USD", amount: "1000000", instructedAmount: "1000000", remittanceInfo: "INVESTMENT", charges: "OUR" },
    beneficiary: { swiftCode: "BNINIDJA", accountNumber: "987654321", accountName: "PT CITI BENEFICIARY", bankName: "BANK NEGARA INDONESIA", address: "JAKARTA" },
    sender: { bankName: "CITIBANK", senderServer: "CITIIDJXXXX", instrument: "MT103" },
  });
  const handleChange = (section, field, value) => setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, bankId: "citi", selectedBank: "CitiBank", transactionDate: new Date().toLocaleString(), generatedAt: new Date().toISOString() });
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">Citi</div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">CitiBank Transfer</h2>
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
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.institution.swiftCode}
              onChange={(e) => handleChange("institution", "swiftCode", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Amount *</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
              value={formData.transaction.amount}
              onChange={(e) => handleChange("transaction", "amount", e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <button type="submit" className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg">
        🚀 GENERATE CITI MT103
      </button>
      <div className="text-center mt-4 text-gray-400 text-xs tracking-widest">sqr400web.com</div>
    </form>
  );
};
export default CitiForm;
