"use client";

import { useState } from "react";

const CISForm = ({ onSubmit, initialData = {} as any }: any) => {
  const [formData, setFormData] = useState({
    companyInfo: {
      companyName: initialData.companyInfo?.companyName || "PAT PROCESS AUTOMATION TECHNOLOGIES GMBH",
      companyRegAddress: initialData.companyInfo?.companyRegAddress || "WALLBRUNNSTR 43 HH, 79539 LÖRRACH, GERMANY",
      companyRegNo: initialData.companyInfo?.companyRegNo || "HRB 413737",
      representedBy: initialData.companyInfo?.representedBy || "MR. OBUCHOWICZ RYSZARD ANDRZEJ",
      title: initialData.companyInfo?.title || "DIRECTOR",
      passportNo: initialData.companyInfo?.passportNo || "EM 2208325",
      dateOfIssue: initialData.companyInfo?.dateOfIssue || "09.10.2017",
      dateOfExpiry: initialData.companyInfo?.dateOfExpiry || "09.10.2027",
      placeOfIssue: initialData.companyInfo?.placeOfIssue || "POLAND",
    },
    bankInfo: {
      bankName: initialData.bankInfo?.bankName || "DEUTSCHE BANK AG",
      bankAddress: initialData.bankInfo?.bankAddress || "Senser Platz 2, 79539, Lörrach, Germany (DE)",
      swiftCode: initialData.bankInfo?.swiftCode || "DEUTDEDB683",
      accountNumber: initialData.bankInfo?.accountNumber || "0081963100",
      iban: initialData.bankInfo?.iban || "DE51 6837 0024 0081 9631 00",
      accountName: initialData.bankInfo?.accountName || "PAT GMBH",
      bankOfficer: initialData.bankInfo?.bankOfficer || "MR. JAMES VON MOLTKE",
      bankEmail: initialData.bankInfo?.bankEmail || "deutsche-bank@db.com",
    },
    meta: {
      oathDate: initialData.meta?.oathDate || "January 18, 2023",
      template: "cis-v2",
    },
    bankId: "cis-v2",
    selectedBank: "CIS (CLIENT INFO) V2"
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

  const inputClass = "w-full p-2 border border-slate-700 bg-slate-800 text-slate-200 rounded text-sm focus:outline-none focus:border-cyan-500 transition-colors";
  const labelClass = "block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-8 animate-fade-in no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2 uppercase tracking-widest">
          Company Information (CIS V2)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Company Name</label>
            <input type="text" className={inputClass} value={formData.companyInfo.companyName} onChange={(e) => handleChange("companyInfo", "companyName", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Company Reg. Address</label>
            <input type="text" className={inputClass} value={formData.companyInfo.companyRegAddress} onChange={(e) => handleChange("companyInfo", "companyRegAddress", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Company Reg. No</label>
            <input type="text" className={inputClass} value={formData.companyInfo.companyRegNo} onChange={(e) => handleChange("companyInfo", "companyRegNo", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Represented by</label>
            <input type="text" className={inputClass} value={formData.companyInfo.representedBy} onChange={(e) => handleChange("companyInfo", "representedBy", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" className={inputClass} value={formData.companyInfo.title} onChange={(e) => handleChange("companyInfo", "title", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Passport No</label>
            <input type="text" className={inputClass} value={formData.companyInfo.passportNo} onChange={(e) => handleChange("companyInfo", "passportNo", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Date of Issue</label>
            <input type="text" className={inputClass} value={formData.companyInfo.dateOfIssue} onChange={(e) => handleChange("companyInfo", "dateOfIssue", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Date of Expiry</label>
            <input type="text" className={inputClass} value={formData.companyInfo.dateOfExpiry} onChange={(e) => handleChange("companyInfo", "dateOfExpiry", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Place of Issue</label>
            <input type="text" className={inputClass} value={formData.companyInfo.placeOfIssue} onChange={(e) => handleChange("companyInfo", "placeOfIssue", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-blue-400 mb-4 border-b border-slate-800 pb-2 uppercase tracking-widest">
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Bank Name</label>
            <input type="text" className={inputClass} value={formData.bankInfo.bankName} onChange={(e) => handleChange("bankInfo", "bankName", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Bank Address</label>
            <input type="text" className={inputClass} value={formData.bankInfo.bankAddress} onChange={(e) => handleChange("bankInfo", "bankAddress", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Swift Code</label>
            <input type="text" className={inputClass} value={formData.bankInfo.swiftCode} onChange={(e) => handleChange("bankInfo", "swiftCode", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Account Number</label>
            <input type="text" className={inputClass} value={formData.bankInfo.accountNumber} onChange={(e) => handleChange("bankInfo", "accountNumber", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>IBAN</label>
            <input type="text" className={inputClass} value={formData.bankInfo.iban} onChange={(e) => handleChange("bankInfo", "iban", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Account Name</label>
            <input type="text" className={inputClass} value={formData.bankInfo.accountName} onChange={(e) => handleChange("bankInfo", "accountName", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Bank Officer</label>
            <input type="text" className={inputClass} value={formData.bankInfo.bankOfficer} onChange={(e) => handleChange("bankInfo", "bankOfficer", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Bank E-Mail</label>
            <input type="text" className={inputClass} value={formData.bankInfo.bankEmail} onChange={(e) => handleChange("bankInfo", "bankEmail", e.target.value)} />
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-emerald-400 mb-4 border-b border-slate-800 pb-2 uppercase tracking-widest">
          Additional Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Oath Date</label>
            <input type="text" className={inputClass} placeholder="e.g. January 18, 2023" value={formData.meta.oathDate} onChange={(e) => handleChange("meta", "oathDate", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all uppercase tracking-widest text-sm"
        >
          Generate CIS V2 Document
        </button>
      </div>
    </form>
  );
};

export default CISFormV2;
