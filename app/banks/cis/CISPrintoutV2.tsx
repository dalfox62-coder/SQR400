import React, { useEffect } from "react";
import Image from "next/image";

const CISPrintoutV2 = ({ data, onBack, isPublic = false }: { data: any, onBack?: () => void, isPublic?: boolean }) => {
  useEffect(() => {
    if (!isPublic) {
      document.body.classList.add("print-mode");
      return () => document.body.classList.remove("print-mode");
    }
  }, [isPublic]);

  const company = data.companyInfo || {};
  const bank = data.bankInfo || {};
  const meta = data.meta || {};

  return (
    <div className={isPublic ? "w-full flex flex-col items-center" : "bg-slate-900 border border-slate-800 rounded-3xl p-6 print:bg-white print:border-none print:p-0 shadow-2xl text-slate-100"}>
      
      {/* Back and Print buttons */}
      {!isPublic && (
        <div className="flex flex-wrap justify-between gap-3 mb-6 no-print">
          {onBack ? (
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold transition-all duration-200 text-sm border border-slate-700"
            >
              ← Back to Form
            </button>
          ) : <div />}
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 text-sm shadow-lg shadow-cyan-500/20"
          >
            🖨️ Print / Download PDF
          </button>
        </div>
      )}
      {isPublic && (
        <div className="flex justify-center mb-6 no-print w-full">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 shadow-xl shadow-cyan-500/20 flex items-center gap-2"
          >
            <span className="text-xl">🖨️</span> Print / Download PDF
          </button>
        </div>
      )}

      {/* Pages Container */}
      <div 
        className={`flex flex-col items-center gap-8 ${isPublic ? 'my-0 print:my-0' : 'my-4'} print:my-0 print:gap-0 ${isPublic ? 'bg-transparent py-0' : 'bg-slate-950/60 py-8 px-4 rounded-2xl'} print:bg-white print:p-0`}
      >
        <div className={`w-[210mm] max-w-[210mm] mx-auto bg-white p-[15mm] text-black ${isPublic ? 'shadow-2xl' : 'shadow-2xl'} print:shadow-none print:p-0 relative font-sans text-sm print-page`} style={{ fontFamily: "Arial, sans-serif" }}>
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide">CLIENT INFORMATION SHEET</h1>
        </div>

        {/* Subtitle */}
        <div className="mb-4 text-blue-600 uppercase">
          COMPANY INFORMATION
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-black mb-6 text-[13.5px]">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-1/3 border-r border-black py-2 px-3">Company Name:</td>
              <td className="w-2/3 py-2 px-3 uppercase">{company.companyName}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Company Reg. Address:</td>
              <td className="py-2 px-3 uppercase">{company.companyRegAddress}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Company Reg. No:</td>
              <td className="py-2 px-3 uppercase">{company.companyRegNo}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Represented by:</td>
              <td className="py-2 px-3 uppercase">{company.representedBy}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Title:</td>
              <td className="py-2 px-3 uppercase">{company.title}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Passport №:</td>
              <td className="py-2 px-3 uppercase">{company.passportNo}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Date of Issue:</td>
              <td className="py-2 px-3 uppercase">{company.dateOfIssue}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Date of Expiry:</td>
              <td className="py-2 px-3 uppercase">{company.dateOfExpiry}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Place of Issue:</td>
              <td className="py-2 px-3 uppercase">{company.placeOfIssue}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Bank Name:</td>
              <td className="py-2 px-3 uppercase">{bank.bankName}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Bank Address:</td>
              <td className="py-2 px-3">{bank.bankAddress}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Swift Code:</td>
              <td className="py-2 px-3 uppercase">{bank.swiftCode}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Account Number :</td>
              <td className="py-2 px-3 uppercase">{bank.accountNumber}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">IBAN :</td>
              <td className="py-2 px-3 uppercase">{bank.iban}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Account Name:</td>
              <td className="py-2 px-3 uppercase">{bank.accountName}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black py-2 px-3">Bank Officer:</td>
              <td className="py-2 px-3 uppercase">{bank.bankOfficer}</td>
            </tr>
            <tr>
              <td className="border-r border-black py-2 px-3">Bank E-Mail:</td>
              <td className="py-2 px-3 text-blue-600 underline">{bank.bankEmail}</td>
            </tr>
          </tbody>
        </table>

        {/* Oath */}
        <div className="mb-4 text-[14px]">
          I, {company.representedBy}, hereby swear under penalty of perjury, that the information provided herein is accurate and true as of this date: <span className="text-blue-700">{meta.oathDate}</span>
        </div>

        {/* Signature Section */}
        <div className="mb-2 text-[14px]">
          For and on behalf of {company.companyName}:
        </div>

        <div className="mb-4 mt-2 relative w-[350px] h-[130px]">
          <img 
            src="/images/cis-v2-stamp.png" 
            alt="Signature and Stamp" 
            className="w-full h-full object-contain opacity-90 mix-blend-multiply"
          />
        </div>

        <div className="mt-4 text-[14px]">
          <div className="flex mb-3">
            <span className="mr-2">Signature:</span>
            <span className="flex-grow border-b border-black inline-block w-64 max-w-[300px]"></span>
          </div>
          <div>
            Name: {company.representedBy}
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};

export default CISPrintoutV2;
