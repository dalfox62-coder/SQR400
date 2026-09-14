"use client";

import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const POFPrintout = ({ data, onBack, isPublic = false }: { data: any, onBack?: () => void, isPublic?: boolean }) => {
  useEffect(() => {
    if (!isPublic) {
      document.body.classList.add("print-mode");
      return () => document.body.classList.remove("print-mode");
    }
  }, [isPublic]);

  const meta = data.meta || {};
  const bank = data.bankInfo || {};
  const account = data.accountInfo || {};
  const transaction = data.transactionInfo || {};
  const officers = data.officers || {};

  const [baseUrl, setBaseUrl] = useState("");
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const qrValue = data.slug ? `${baseUrl}/doc/${data.slug}` : "https://sqr400-ten.vercel.app/";

  return (
    <div className={isPublic ? "w-full flex flex-col items-center bg-slate-950 min-h-screen py-8" : "bg-slate-900 border border-slate-800 rounded-3xl p-6 print:bg-white print:border-none print:p-0 shadow-2xl text-slate-100"}>
      
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
        <div 
          className={`w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white text-black ${isPublic ? 'shadow-2xl' : 'shadow-2xl'} print:shadow-none print:p-0 relative font-sans text-[12px] print-page overflow-hidden`} 
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          
          {/* Full Page Background Image */}
          <div className="absolute inset-0 z-0">
             <img src="/pof-bg-new.png" alt="POF Background" className="w-full h-full object-fill" />
          </div>

          {/* Cover for baked-in QR, Barcode, and Date */}
          <div className="absolute top-0 z-20 flex flex-col items-center justify-start pt-[10%] rounded-b-md shadow-sm bg-[#e3eff9]"
               style={{ left: '1.5%', width: '23%', height: '18.5%' }}>
             <QRCode
                value={qrValue}
                size={256}
                style={{ width: '80%', height: 'auto', maxWidth: '120px' }}
                level="M"
                fgColor="#000000"
                bgColor="transparent"
             />
          </div>

          <div className="relative z-10 p-[12mm] px-[15mm]">
            {/* Spacer for top header (QR code and logos) */}
            <div className="relative h-[50px] w-full">
            </div>

            <div className="flex flex-col items-center mb-4 mt-2">
              <div className="font-bold text-[16px] relative z-30">
                BANK PROOF OF FUNDS
              </div>
            </div>

            <div className="mb-6 uppercase mt-6 relative z-30">
              DATE: {meta.date}
            </div>

            <div className="mb-6 uppercase leading-relaxed text-justify">
              WE, {bank.bankName}, {bank.bankAddress}, CONFIRM WITH FULL BANK RESPONSIBILITY THAT THE ACCOUNT HOLDERS.
              <br/><br/>
              {account.accountName}, REPRESENTED BY {account.accountSignatory}, HAVE CASH FUNDS OF {transaction.amountWords?.toUpperCase()} ({transaction.currencyCode}{transaction.amountNumeric}) PRESENTLY ON DEPOSIT IN THE ABOVE REFERENCED ACCOUNT AS DESCRIBED BELOW:
            </div>

            {/* Table-like aligned info */}
            <div className="mb-8 ml-4">
              <div className="grid grid-cols-[200px_10px_1fr] gap-y-2 uppercase">
                <div>BANK NAME</div><div>:</div><div>{bank.bankName}</div>
                <div>BANK ADDRESS</div><div>:</div><div>{bank.bankAddress}</div>
                <div>BANK TEL NUMBER</div><div>:</div><div>{bank.bankTel}</div>
                <div>BANK FAX NUMBER</div><div>:</div><div>{bank.bankFax}</div>
                <div>BANK OFFICER NAME</div><div>:</div><div>{bank.bankOfficerName}</div>
                <div>BANK OFFICER EMAIL</div><div>:</div><div className="lowercase text-blue-600 underline">{bank.bankOfficerEmail}</div>
                <div>BANK SWIFT CODE</div><div>:</div><div>{bank.bankSwiftCode}</div>
                <div>ACCOUNT NUMBER</div><div>:</div><div>{account.accountNumber}</div>
                <div>ACCOUNT NAME</div><div>:</div><div>{account.accountName}</div>
                <div>ACCOUNT SIGNATORY</div><div>:</div><div>{account.accountSignatory}</div>
                <div>BENEFICIARY NAME</div><div>:</div><div>{account.beneficiaryName}</div>
                <div>AMOUNT</div><div>:</div><div>{transaction.currencyCode}{transaction.amountNumeric} ({transaction.amountWords})</div>
              </div>
            </div>

            <div className="mb-6 uppercase leading-relaxed text-justify">
              WE FURTHER CONFIRM THAT THESE FUNDS ARE CLEAN, CLEAR AND OF NON-CRIMINAL ORIGIN AND HAVE BEEN LEGALLY DERIVED FROM THE SOURCE OF NORMAL COMMERCIAL ORIGIN, AND FREE FROM ANY LIENS AND ENCUMBRANCES.
            </div>

            <div className="mb-10 uppercase leading-relaxed text-justify">
              WE IRREVOCABLY CONFIRM WITH FULL BANK RESPONSIBILITY THAT THESE FUNDS CAN BE AUTHENTICATED AND VERIFIED FOR ABOVE REFERENCED TRANSACTION CODES(S). WE ARE PREPARED TO FACILITATE THE VERIFICATION AND AUTHENTICATION OF THESE FUNDS ON OUR CLIENT INSTRUCTION {account.accountName}.
              THE SAID DEPOSITED FUNDS HEREIN CAN BE AUTHENTICATED AND VERIFIED VIA SCREEN ON A BANK TO BANK BASIS.
            </div>

            {/* Bottom Section */}
            <div className="uppercase">
              <div className="mb-1">FOR AND ON BEHALF OF :</div>
              <div className="mb-1">{bank.bankName}</div>
              <div className="mb-4 w-64 leading-tight">{bank.bankAddress}</div>
            </div>

            <div className="relative w-full pr-8 text-[10px] mt-8 h-[120px]">
               {/* Officer Text placed above original baked-in signatures */}
               <div className="absolute top-0 left-0 w-full flex justify-between z-30">
                  <div className="flex flex-col">
                    <div className="uppercase mb-1">AUTHORIZED OFFICER</div>
                    <div className="uppercase mb-1">{officers.officer1Name}</div>
                    <div className="uppercase">{officers.officer1Title}</div>
                  </div>
                  
                  <div className="flex flex-col text-left w-64">
                    <div className="uppercase mb-1">AUTHORIZED OFFICER</div>
                    <div className="uppercase mb-1">{officers.officer2Name}</div>
                    <div className="uppercase">{officers.officer2Title}</div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default POFPrintout;
