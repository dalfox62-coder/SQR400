"use client";

import { useState } from "react";

const POFForm = ({ onSubmit, initialData = {} as any }: any) => {
  const [formData, setFormData] = useState({
    meta: {
      date: initialData.meta?.date || "24/MAY/2018",
      template: "pof",
    },
    bankInfo: {
      bankName: initialData.bankInfo?.bankName || "DEUTSCHE BANK AG LONDON",
      bankAddress: initialData.bankInfo?.bankAddress || "WINCHESTER HOUSE, 8 BISHOPSGATE, EC2N 4DA LONDON, UK.",
      bankTel: initialData.bankInfo?.bankTel || "+44 121 615 7200",
      bankFax: initialData.bankInfo?.bankFax || "+44 121 627 6288",
      bankOfficerName: initialData.bankInfo?.bankOfficerName || "MR. MARCUS SCHENCK",
      bankOfficerEmail: initialData.bankInfo?.bankOfficerEmail || "marcus.schenck@db.com",
      bankSwiftCode: initialData.bankInfo?.bankSwiftCode || "DEUTGB2LXXX",
    },
    accountInfo: {
      accountNumber: initialData.accountInfo?.accountNumber || "0925993800",
      accountName: initialData.accountInfo?.accountName || "AVA GLOBAL GMBH",
      accountSignatory: initialData.accountInfo?.accountSignatory || "MR. SHOBEIR MIRKHAN",
      beneficiaryName: initialData.accountInfo?.beneficiaryName || "MR. MOHAMMAD HAMED DIBA ARDEKANI",
    },
    transactionInfo: {
      amountNumeric: initialData.transactionInfo?.amountNumeric || "6,900,000,000.00",
      amountWords: initialData.transactionInfo?.amountWords || "Six billion and nine hundred million euros",
      currencyCode: initialData.transactionInfo?.currencyCode || "€",
    },
    officers: {
      officer1Name: initialData.officers?.officer1Name || "MARCUS SCHENCK (PIN75456CFO)",
      officer1Title: initialData.officers?.officer1Title || "CHIEF OPERATING OFFICER",
      officer2Name: initialData.officers?.officer2Name || "CHRISTIAN SEWING - ID CS9089",
      officer2Title: initialData.officers?.officer2Title || "CHIEF EXECUTIVE OFFICER",
    },
    bankId: "pof",
    selectedBank: "POF (PROOF OF FUND)"
  });

  const handleChange = (section: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full p-2 border border-slate-700 bg-slate-800 text-white rounded focus:outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-sm font-semibold mb-1 text-slate-300";
  const sectionClass = "bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mb-6";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Header Info */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <span>📅</span> HEADER & DATE
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Document Date</label>
            <input
              type="text"
              className={inputClass}
              value={formData.meta.date}
              onChange={(e) => handleChange("meta", "date", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <span>👤</span> ACCOUNT DETAILS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Account Name (Company)</label>
            <input
              type="text"
              className={inputClass}
              value={formData.accountInfo.accountName}
              onChange={(e) => handleChange("accountInfo", "accountName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Account Signatory</label>
            <input
              type="text"
              className={inputClass}
              value={formData.accountInfo.accountSignatory}
              onChange={(e) => handleChange("accountInfo", "accountSignatory", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Beneficiary Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.accountInfo.beneficiaryName}
              onChange={(e) => handleChange("accountInfo", "beneficiaryName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Account Number</label>
            <input
              type="text"
              className={inputClass}
              value={formData.accountInfo.accountNumber}
              onChange={(e) => handleChange("accountInfo", "accountNumber", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transaction Info */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <span>💰</span> FUND DETAILS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Amount (Numeric)</label>
            <input
              type="text"
              className={inputClass}
              value={formData.transactionInfo.amountNumeric}
              onChange={(e) => handleChange("transactionInfo", "amountNumeric", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Currency Code (e.g. € or USD)</label>
            <input
              type="text"
              className={inputClass}
              value={formData.transactionInfo.currencyCode}
              onChange={(e) => handleChange("transactionInfo", "currencyCode", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Amount in Words</label>
            <input
              type="text"
              className={inputClass}
              value={formData.transactionInfo.amountWords}
              onChange={(e) => handleChange("transactionInfo", "amountWords", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bank Info */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <span>🏦</span> BANK DETAILS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Bank Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.bankInfo.bankName}
              onChange={(e) => handleChange("bankInfo", "bankName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Bank Swift Code</label>
            <input
              type="text"
              className={inputClass}
              value={formData.bankInfo.bankSwiftCode}
              onChange={(e) => handleChange("bankInfo", "bankSwiftCode", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Bank Address</label>
            <input
              type="text"
              className={inputClass}
              value={formData.bankInfo.bankAddress}
              onChange={(e) => handleChange("bankInfo", "bankAddress", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Bank Tel Number</label>
            <input
              type="text"
              className={inputClass}
              value={formData.bankInfo.bankTel}
              onChange={(e) => handleChange("bankInfo", "bankTel", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Bank Fax Number</label>
            <input
              type="text"
              className={inputClass}
              value={formData.bankInfo.bankFax}
              onChange={(e) => handleChange("bankInfo", "bankFax", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Bank Officer Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.bankInfo.bankOfficerName}
              onChange={(e) => handleChange("bankInfo", "bankOfficerName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Bank Officer Email</label>
            <input
              type="text"
              className={inputClass}
              value={formData.bankInfo.bankOfficerEmail}
              onChange={(e) => handleChange("bankInfo", "bankOfficerEmail", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Officers Info */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <span>✍️</span> AUTHORIZED OFFICERS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Officer 1 Name & PIN</label>
            <input
              type="text"
              className={inputClass}
              value={formData.officers.officer1Name}
              onChange={(e) => handleChange("officers", "officer1Name", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Officer 1 Title</label>
            <input
              type="text"
              className={inputClass}
              value={formData.officers.officer1Title}
              onChange={(e) => handleChange("officers", "officer1Title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Officer 2 Name & PIN</label>
            <input
              type="text"
              className={inputClass}
              value={formData.officers.officer2Name}
              onChange={(e) => handleChange("officers", "officer2Name", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Officer 2 Title</label>
            <input
              type="text"
              className={inputClass}
              value={formData.officers.officer2Title}
              onChange={(e) => handleChange("officers", "officer2Title", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-105"
        >
          Generate POF Document 📄
        </button>
      </div>
    </form>
  );
};

export default POFForm;
