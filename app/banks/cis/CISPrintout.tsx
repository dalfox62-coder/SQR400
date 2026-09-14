import React, { useEffect } from "react";
import Image from "next/image";

const CISPrintout = ({ data, onBack, isPublic = false }: { data: any, onBack?: () => void, isPublic?: boolean }) => {
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
    <div className={`bg-white text-black min-h-screen ${isPublic ? '' : 'p-4 md:p-8'}`}>
      {!isPublic && onBack && (
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition no-print"
        >
          ← Back to Edit
        </button>
      )}

      <div className="max-w-[210mm] mx-auto bg-white p-[15mm] shadow-none print:shadow-none print:p-0 relative font-sans text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-wide">CLIENT INFORMATION SHEET</h1>
        </div>

        {/* Subtitle */}
        <div className="mb-4 text-blue-600 uppercase">
          COMPANY INFORMATION
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-black mb-8 text-[13.5px]">
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
        <div className="mb-6 text-[14px]">
          I, {company.representedBy}, hereby swear under penalty of perjury, that the information provided herein is accurate and true as of this date: <span className="text-blue-700">{meta.oathDate}</span>
        </div>

        {/* Signature Section */}
        <div className="mb-4 text-[14px]">
          For and on behalf of {company.companyName}:
        </div>

        <div className="mb-8 mt-4 relative w-[350px] h-[150px]">
          <Image 
            src="/pat-signature.jpeg" 
            alt="Signature and Stamp" 
            layout="fill"
            objectFit="contain"
            className="opacity-90 mix-blend-multiply"
          />
        </div>

        <div className="mt-8 text-[14px]">
          <div className="flex mb-3">
            <span className="mr-2">Signature:</span>
            <span className="flex-grow border-b border-black inline-block w-64 max-w-[300px]"></span>
          </div>
          <div>
            Name: {company.representedBy}
          </div>
        </div>

      </div>

      {!isPublic && (
        <div className="fixed bottom-8 right-8 no-print z-50">
          <button
            onClick={() => window.print()}
            className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-4 shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-110 flex items-center justify-center group"
            title="Print Document"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default CISPrintout;
