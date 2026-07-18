"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import QRCode from "react-qr-code";

const formatNumber = (numStr) => {
   if (!numStr) return "";
   const num = parseFloat(numStr.replace(/,/g, ""));
   if (isNaN(num)) return numStr;
   return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatAmountStr = (amount, currency) => {
   return `${formatNumber(amount)}`;
};

const getPageBreakStyle = () => ({
   pageBreakAfter: "always",
   breakAfter: "page",
});

const DeutschePrintoutV2 = ({ data, onBack, isPublic = false }: { data: any, onBack?: () => void, isPublic?: boolean }) => {
   const [baseUrl, setBaseUrl] = useState("https://sqr400-ten.vercel.app");

   useEffect(() => {
      if (typeof window !== "undefined") {
         setBaseUrl(window.location.origin);
      }
   }, []);

   const { institution, transaction, beneficiary, meta } = data;
   const postDateFormatted = transaction.valueDate ? new Date(transaction.valueDate).toLocaleDateString("en-GB").replace(/\//g, ".") : "30.06.2025";
   const postTime = transaction.postTime || "11:49:54";

      const formatNumber = (num) => {
      if (!num) return "0.00";
      return new Intl.NumberFormat("en-US", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      }).format(parseFloat(num));
   };

   const getFormattedDates = (valueDateStr, transactionTimeStr) => {
      let dateObj = new Date();
      if (valueDateStr) {
         const parts = valueDateStr.split("-");
         if (parts.length === 3) {
            dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
         }
      }
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      const timeStr = transactionTimeStr || "19:17:41";
      return { dateStr: `${day}/${month}/${year}`, timeStr: timeStr };
   };

   const dates = getFormattedDates(transaction.valueDate, transaction.transactionTime);
   const amtFormatted = formatNumber(transaction.amount);
   const currencyUpper = (transaction.currency || "EUR").toUpperCase();
   const charges = (transaction.charges || "OUR").toUpperCase();
   const senderRef = (transaction.senderReference || "DEUTDEFF992541320116 ").toUpperCase();
   const senderSwift = (institution.swiftCode || "DEUTDEFF9925").toUpperCase();
   const receiverSwift = (beneficiary.swiftCode || "BNINIDJAXXX").toUpperCase();

   const generateMT103Text = (isPage2 = false) => {
      if (!isPage2) {
         return `MESSAGE REFERENCE: 1856734949-1247881431                       CUSTOMER'S COPY
----------------------------INSTANCE TYPE AND TRANSMISSION----------------------------
*** NOTIFICATION (TRANSMISSION) OF ORIGINAL SENT TO SWIFT (ACK)
*** NETWORK DELIVERY STATUS   : NETWORK ACK
*** PRIORITY/DELIVERY         : NORMAL
*** MESSAGE INPUT REFERENCE   : 20230413${senderSwift}20230413
*** MESSAGE OUTPUT REFERENCE  : 500700100951392000${receiverSwift}5809325104131N
--------------------------------SWIFT MESSAGE HEADER--------------------------------
***SWIFT INPUT      : SWIFT MT103TT CASH TRANSFER
FROM:
***SENDER           : ${senderSwift}
***BANK NAME        : ${(institution.bankName || "DEUTSCHE BANK AG").toUpperCase()}
***BANK ADDRESS     : ${(institution.address || "DEUTSCHE BANK A.G. TAUNUSANLAFE 12, FERANKURT AM MAIN 60254 FERNKFURT GERMANY").toUpperCase()}
***ACCOUNT NAME     : ${(institution.accountName || "DEUTSCHE TRADING GMBH").toUpperCase()}
***ACCOUNT NUMBER   : ${(institution.accountNumber || "DE07370700600359752300").toUpperCase()}
***SWIFT CODE       : ${senderSwift}
TO:
***BANK NAME        : ${(beneficiary.bankName || "PT BANK NEGARA INDONESIA TBK").toUpperCase()}
***BANK ADDRESS     : ${(beneficiary.address || "KCU KEDIRI, JL. BRAWIJAYA NO. 17, JAWA TIMUR").toUpperCase()}
***ACCOUNT NAME     : ${(beneficiary.accountName || "PT DEUTSCHE BENEFICIARY INDO").toUpperCase()}
***ACCOUNT NUMBER   : ${(beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber || "0020359752300").toUpperCase()}
***SWIFT CODE       : ${receiverSwift}
-----------------------------------MESSAGE TEXT-----------------------------------
*** F20:      TRANSACTION REFERENCE CODE     : ${senderRef}
*** F23B:     BANK OPERATION CODE            : CRED
*** F32A:     CURRENCY/INSTRUCTED
              DATE                           : ${dates.dateStr}
              CURRENCY                       : ${currencyUpper}
              AMOUNT                         : €${amtFormatted}
*** F33B:     CURRENCY/ORIGINAL ORDERED AMOUNT
              CURRENCY                       : ${currencyUpper}
              AMOUNT                         : €${amtFormatted}
*** F50K:     ORDERING CUSTOMER-NAME & ADDRESS
              ACCOUNT NUMBER                 : ${(institution.accountNumber || "DE07370700600359752300").toUpperCase()}
              ACCOUNT NAME                   : ${(institution.accountName || "DEUTSCHE TRADING GMBH").toUpperCase()}
              ACCOUNT ADDRESS                : ${(institution.address || "DEUTSCHE BANK A.G. TAUNUSANLAFE 12, FERANKURT AM MAIN 60254 FERNKFURT GERMANY").toUpperCase()}
*** F52A:     ORDERING INSTITUTION
              SENDER                         : ${senderSwift}
              BANK NAME                      : ${(institution.bankName || "DEUTSCHE BANK AG").toUpperCase()}
              BANK ADDRESS                   : ${(institution.address || "DEUTSCHE BANK A.G. TAUNUSANLAFE 12, FERANKURT AM MAIN 60254 FERNKFURT GERMANY").toUpperCase()}
*** F57A:     ACCOUNT WITH INSTITUTION
              RECEIVER SWIFT                 : ${receiverSwift}
              BANK RECEIVER                  : ${(beneficiary.bankName || "PT BANK NEGARA INDONESIA TBK").toUpperCase()}
              BANK ADDRESS                   : ${(beneficiary.address || "KCU KEDIRI, JL. BRAWIJAYA NO. 17, JAWA TIMUR").toUpperCase()}
*** F59       BENEFICIARY CUSTOMER
              ACCOUNT NAME                   : ${(beneficiary.accountName || "PT DEUTSCHE BENEFICIARY INDO").toUpperCase()}
              ACCOUNT NUMBER                 : ${(beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber || "0020359752300").toUpperCase()}
*** F70:      REMITTANCE INFORMATION         : ${(transaction.remittanceInfo || "INVOICE SETTLEMENT").toUpperCase()}
*** F71A:     DETAILS OF CHARGES             : ${charges}
*** F72:      SENDER TO RECEIVER INFORMATION : FOR INVESTMENT
            /// PLEASE ADVISE THE BENEFICIARY OF THIS SWIFT THIS TRANSFER IS VALID FOR PAYMENT
            /// UPON IDENTIFICATION, THE DAY OF RECEIPT. THIS IRREVOCABLE CASH BACKED SWIFT
            /// SWIFT MT103TT CASH TRANSFER CAN BE RELIED UPON FOR FULL CASH.
*** F77B:     REGULATORY REPORTING: €${amtFormatted}
*** F79:      NARRATIVE
/// FOR AND ON BEHALF OF OUR CLIENT ${(institution.accountName || "DEUTSCHE TRADING GMBH").toUpperCase()}, WITH ACCOUNT NUMBER:
${(institution.accountNumber || "DE07370700600359752300").toUpperCase()}, WE ${(institution.bankName || "DEUTSCHE BANK AG").toUpperCase()}, ${(institution.address || "DEUTSCHE BANK A.G. TAUNUSANLAFE 12, FERANKURT AM MAIN 60254 FERNKFURT GERMANY").toUpperCase()}
HEREBY CONFIRM WITH FULL BANKING RESPONSIBILITY THAT THE ABOVE FUNDS ARE GOOD, CLEAN, CLEAR AND
TAXED FUNDS OF NON-CRIMINAL ORIGIN, FREE FROM ANY LIENS OR ENCUMBRANCES AND PAID FOR INVESTMENTS
PURPOSES SWIFT MT103TT CASH TRANSFER WITH UETR CODE IS FOR IMMEDIATE CASH-INSTANT SAME DAY
VALUE AND NO MAIL OR SWIFT CONFIRMATION SHALL FOLLOW.

FOR AND ON BEHALF OF ${(institution.bankName || "DEUTSCHE BANK AG").toUpperCase()}, ${(institution.address || "DEUTSCHE BANK A.G. TAUNUSANLAFE 12, FERANKURT AM MAIN 60254 FERNKFURT GERMANY").toUpperCase()}.
AUTOMATED MESSAGE DOESN'T NEED ANY SIGNATURE

AUTHORIZED OFFICER 1: MR. JAMES VON MOLTKE, CHIEF FINANCIAL OFFICER (PIN: J78414M )
AUTHORIZED OFFICER 2: MR. CARSTEN LEWERENZ, HEAD OF BUSINESS CUSTOMERS (PIN: 53329)
FOR AND ON BEHALF OF ${(institution.bankName || "DEUTSCHE BANK AG").toUpperCase()}
${(institution.address || "DEUTSCHE BANK A.G. TAUNUSANLAFE 12, FERANKURT AM MAIN 60254 FERNKFURT GERMANY").toUpperCase()}.`;
      }

      return `--------------------------------MESSAGE TRAILER--------------------------------
HK:8983417752320
PKI-SIGNATURE:3728030272
TRACKING CODE:52E8F5B282
--------------------------------INTERVENTIONS----------------------------------
CONFIRMED AND RECEIVED
TRANSACTION STATUS: APPROVED
SWIFT MESSAGE: SWIFT MT103TT CASH TRANSFER
SWIFT COVERAGE: YES
CATEGORY: NETWORK REPORT
CREATION DATE & TIME: ${dates.dateStr} ${dates.timeStr}
APPLICATION: SWIFT
OPERATION: SYSTEM
RECEIVER: ${receiverSwift}
TEXT:{1:F01DEUTDEFF99252893429278}{2:I103BNINIDJAXXXX}{3:119:STP}{4:${senderRef}}
5:{MAC:00000000}{PDE:}{S:{SAC:}}{COP:P}

ANSWERBACK AND ACKNOWLEDGMENT MESSAGE AUTOMATED FILE TRANSFER (AFT) GATEWAY RESPONSE VALIDATION
    SERVICE PROVIDER LOG/APPLICATION GENERATED REPORT ACKNOWLEDGMENT AND AUTHENTICATION
                   ACK/NAG DELIVERY FTA/FTI CONFIRMATION STATEMENT PASS/ACK STATUS

0050 CNT, ---------------------------------------------------------------------- VALID
0060 RFF-DTM, ------------------------------------------------------------------ VALID
0070 RFF, ---------------------------------------------------------------------- VALID
0080 DTM, ---------------------------------------------------------------------- VALID
0090 NAD-CTA-COM, -------------------------------------------------------------- VALID
0100 NAD, ---------------------------------------------------------------------- VALID
0120 COM, ---------------------------------------------------------------------- VALID
0130 ERC-FTX-5G4, -------------------------------------------------------------- VALID
0140 ERC, ---------------------------------------------------------------------- VALID
0150 FTX, ---------------------------------------------------------------------- VALID
0160 RFF-FTX, ------------------------------------------------------------------ VALID
0170 REF, ---------------------------------------------------------------------- VALID
0180 FTX, ---------------------------------------------------------------------- VALID
0190 UNT, ---------------------------------------------------------------------- VALID

{XMT DELIVERY REPORT}
MESSAGE TYPE: SWIFT MT103TT CASH TRANSFER
PRIORITY: URGENT
RECEIVED: ${receiverSwift}
TRANSACTION REFERENCE NUMBER: ${senderRef}
TRANSACTION STATUS: APPROVED
AMOUNT TRANSFERRED: €${amtFormatted}
DATE OF EXECUTION: ${dates.dateStr} ${dates.timeStr}
--------------------------------CONFIRMED AND RECEIVED---------------------------------
TRANSACTION STATUS: APPROVED
AMOUNT TRANSFERRED: €${amtFormatted}
DATE OF EXECUTION: ${dates.dateStr} ${dates.timeStr}
--------------------------------END OF TRANSMISSION------------------------------------`;
   };

   return (
      <div translate="no" className={`notranslate min-h-screen pb-10 print:pb-0 ${isPublic ? 'bg-slate-900' : 'bg-gray-200'}`}>
         <style dangerouslySetInnerHTML={{
            __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
          .print-page-wrapper {
            width: 750px !important;
            height: 1050px !important;
            overflow: hidden !important;
            position: relative !important;
            box-shadow: none !important;
            margin: 0 auto !important;
            page-break-after: always;
            break-after: page;
          }
          .print-page-wrapper:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .print-landscape-content {
            transform: scale(0.7142);
            transform-origin: top left;
            width: 1050px !important;
            min-height: 1050px !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-bg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

         {/* Control Actions */}
         <div className="max-w-5xl mx-auto pt-6 px-4 mb-6 flex flex-wrap justify-end gap-3 no-print">
            {!isPublic && (
               <button onClick={onBack} className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold transition text-base text-gray-800 mr-auto">
                  ← Back to Form
               </button>
            )}
            <button onClick={() => window.print()} className="px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white rounded-lg font-semibold transition text-base shadow-md">
               🖨️ Download / Save as PDF
            </button>
         </div>

         <div id="printable-area" className="w-full mx-auto printable-container flex flex-col gap-8 print:gap-0 items-center">

            {/* PAGE 1 */}
            <div className="print-page-wrapper w-[750px] px-10 py-6 bg-white text-black relative shadow-2xl print:shadow-none" style={{ minHeight: '1050px' }}>

               {/* Vertical Barcode on the right edge */}
               <div className="absolute right-4 top-[220px] w-[50px] h-[350px] flex items-center justify-center">
                  <div className="transform rotate-90 flex flex-col items-center gap-1 w-[350px] whitespace-nowrap">
                     <div className="font-mono text-[11px] tracking-[0.2em]">{transaction.senderReference}</div>
                     <img src="/logos/deutsche-barcode.png" alt="Barcode" className="h-[35px] w-[350px] object-fill mix-blend-multiply" />
                  </div>
               </div>

               <div className="flex justify-between items-start mb-4">
                  <div className="text-[#0018a8]">
                     <h1 className="text-3xl font-sans tracking-tight">Deutsche Bank</h1>
                     <h2 className="text-xl font-sans text-blue-500">OnlineBanking & Brokerage</h2>
                  </div>
                  <div className="text-right text-[#0018a8] flex flex-col items-end">
                     <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-sans font-bold tracking-tight">Deutsche Bank</h1>
                        <div className="w-10 h-10 border-[3px] border-[#0018a8] relative p-1">
                           <div className="w-full h-full bg-white border border-[#0018a8]">
                              <div className="w-[120%] h-[3px] bg-[#0018a8] origin-bottom-left -rotate-45 absolute bottom-1.5 left-1"></div>
                           </div>
                        </div>
                     </div>
                     <h2 className="text-lg font-sans">Aktiengesellschaft</h2>
                     <div className="mt-2 font-bold text-lg underline"><a href="https://www.deutsche-bank.de">https://www.deutsche-bank.de</a></div>
                  </div>
               </div>

               <div className="font-mono text-[9px] leading-[1.15] whitespace-pre-wrap text-black">
                  {generateMT103Text(false)}
               </div>
               <div className="mt-4 flex justify-end">
                  <div className="pr-4 shrink-0">
                     <QRCode
                        value={data.slug ? `${baseUrl}/doc/${data.slug}` : "https://sqr400-ten.vercel.app/"}
                        size={85}
                        level="H"
                        fgColor="#000000"
                        bgColor="#FFFFFF"
                        className="mix-blend-multiply"
                     />
                  </div>
               </div>
            </div>

            {/* PAGE 2 */}
            <div className="print-page-wrapper w-[750px] px-10 py-6 bg-black text-gray-200 print-bg shadow-2xl print:shadow-none" style={{ minHeight: '1050px', backgroundColor: 'black' }}>
               <div className="flex justify-between items-start mb-4 bg-black p-4 print-bg" style={{ backgroundColor: 'black' }}>
                  <div className="text-white">
                     <h1 className="text-3xl font-sans tracking-tight">Deutsche Bank</h1>
                     <h2 className="text-xl font-sans text-blue-400">OnlineBanking & Brokerage</h2>
                  </div>
                  <div className="text-right flex flex-col items-end">
                     <div className="flex items-center gap-3 text-[#0018a8]">
                        <h1 className="text-4xl font-sans font-bold tracking-tight">Deutsche Bank</h1>
                        <div className="w-10 h-10 border-[3px] border-[#0018a8] relative p-1 bg-black print-bg" style={{ backgroundColor: 'black' }}>
                           <div className="w-full h-full bg-black border border-[#0018a8]" style={{ backgroundColor: 'black' }}>
                              <div className="w-[120%] h-[3px] bg-[#0018a8] origin-bottom-left -rotate-45 absolute bottom-1.5 left-1"></div>
                           </div>
                        </div>
                     </div>
                     <h2 className="text-lg font-sans text-[#0018a8]">Aktiengesellschaft</h2>
                     <div className="mt-2 font-bold text-lg underline"><a href="https://www.deutsche-bank.de" className="text-[#0018a8]">https://www.deutsche-bank.de</a></div>
                  </div>
               </div>

               <div className="font-mono text-[9px] leading-[1.15] whitespace-pre-wrap text-gray-300">
                  {generateMT103Text(true)}
               </div>
            </div>

            {/* PAGE 3 */}
            <div className="print-page-wrapper w-[1050px] bg-white print:bg-white text-black relative shadow-2xl print:shadow-none print-bg" style={{ minHeight: '750px' }}>
               <div className="print-landscape-content w-full relative bg-[#f0f8fb] print-bg flex flex-col justify-between" style={{ minHeight: '1050px' }}>
                  <div>
                     <div className="w-full h-16 bg-[#312571] print-bg flex items-end"></div>
                     <div className="px-14 py-8">
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-3 text-[#0018a8]">
                        <div className="w-10 h-10 border-[3px] border-[#0018a8] relative p-1 bg-white">
                           <div className="w-full h-full bg-white border border-[#0018a8]">
                              <div className="w-[120%] h-[3px] bg-[#0018a8] origin-bottom-left -rotate-45 absolute bottom-1.5 left-1"></div>
                           </div>
                        </div>
                        <h1 className="text-4xl font-sans font-bold tracking-tight">Deutsche Bank</h1>
                     </div>
                     <div className="w-40 h-16 border-2 border-[#5b8ab5] rounded-[100%] flex items-center justify-center relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                           <div className="w-full h-[1px] bg-[#5b8ab5] absolute top-1/2"></div>
                           <div className="w-[1px] h-full bg-[#5b8ab5] absolute left-1/2"></div>
                           <div className="w-[85%] h-[55%] border border-[#5b8ab5] rounded-[100%] absolute"></div>
                           <div className="w-[55%] h-[85%] border border-[#5b8ab5] rounded-[100%] absolute"></div>
                        </div>
                        <span className="text-[#3b6d9e] font-serif font-bold text-3xl italic tracking-wider z-10">SWIFT</span>
                     </div>
                  </div>

                  <div className="relative w-[85%]">
                     <div className="grid grid-cols-[1.2fr_2.2fr_1.2fr] gap-0 border-b-2 border-black pb-2 mb-2">
                        <div>
                           <div className="text-xs font-bold -mt-2 bg-[#ffffff] print-bg inline-block px-1 ml-2">Account</div>
                           <div className="border border-black p-2 mt-[-10px] text-sm font-sans pt-3 leading-tight min-h-[50px]">
                              {institution.swiftCode}<br />{institution.accountNumber.substring(2)}
                           </div>
                        </div>
                        <div className="ml-2">
                           <div className="text-xs font-bold -mt-2 bg-[#ffffff] print-bg inline-block px-1 ml-2">Instruction Type</div>
                           <div className="border border-black p-2 mt-[-10px] text-sm font-sans pt-3 leading-tight min-h-[50px] whitespace-nowrap">
                              MT 103 - Internal Receipt Instruction<br />
                              Instruction Sub Type: CASH WIRE TRANSFER
                           </div>
                        </div>
                        <div className="ml-2">
                           <div className="text-xs font-bold -mt-2 bg-[#ffffff] print-bg inline-block px-1 ml-2">GBS Screen</div>
                           <div className="border border-black p-2 mt-[-10px] text-[13px] font-sans pt-3 flex gap-4 h-[50px] items-center whitespace-nowrap">
                              <span>Indicator: MAT3D</span>
                              <span>Date 30.06.2025</span>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-sans">
                        <div>
                           References: {institution.swiftCode}<br />
                           Sender: {institution.bankName}<br />
                           Account Name: {institution.accountName}
                        </div>
                        <div className="border border-black p-2 pt-4 relative">
                           <div className="text-xs font-bold bg-[#ffffff] print-bg px-1 absolute -top-2 left-2">References</div>
                           References: {beneficiary.swiftCode}<br />
                           Receiver: {beneficiary.accountName}<br />
                           {beneficiary.bankName}<br />
                           Account No.: {beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
                        </div>
                     </div>

                     <div className="grid grid-cols-[1.2fr_1.8fr] gap-4 mb-4">
                        <div className="border border-black p-2 pt-4 relative min-h-[120px]">
                           <div className="text-xs font-bold bg-[#ffffff] print-bg px-1 absolute -top-2 left-2">Status</div>
                           <div className="text-xs font-sans mt-2 w-full pr-4">
                              <div className="grid grid-cols-[80px_70px_auto]">
                                 <span>Received</span>
                                 <span>Amount:</span>
                                 <span>{formatNumber(transaction.amount)}</span>
                              </div>
                              <div className="grid grid-cols-[80px_70px_auto] my-1">
                                 <span></span>
                                 <span className="underline text-[11px]">Internal</span>
                                 <span className="underline text-[11px]">External</span>
                              </div>
                              <div className="grid grid-cols-[80px_70px_auto] mb-3">
                                 <span>Currency:</span>
                                 <span>{transaction.currency}</span>
                                 <span>€</span>
                              </div>
                              <div className="flex gap-2">
                                 <span className="underline">PARTICIPANT:</span>
                                 <span>NOT. MOD</span>
                              </div>
                           </div>
                        </div>

                        <div className="border border-black p-2 pt-4 relative min-h-[120px] text-xs font-sans">
                           <div className="text-xs font-bold bg-[#ffffff] print-bg px-1 absolute -top-2 left-2">User Activity</div>
                           <div className="grid grid-cols-[140px_100px_auto] gap-y-1 mt-2">
                              <span>Keyed by:</span><span></span><span></span>
                              <span>Released by:</span><span>{postDateFormatted}</span><span>-  {postTime}</span>
                              <span>Cancelled/Modified by:</span><span></span><span></span>
                              <span>Received by:</span><span>{postDateFormatted}</span><span>-  {meta.receivedTime}</span>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="border border-black p-2 pt-4 relative">
                           <div className="text-xs font-bold bg-[#ffffff] print-bg px-1 absolute -top-2 left-2">Status</div>
                           <div className="flex gap-16 text-xs font-sans mt-1">
                              <span>NEW:</span>
                              <span>MTCH/NMAT</span>
                              <span>NAMT.CMIS</span>
                           </div>
                        </div>
                        <div className="text-xs font-sans p-2">
                           Recipient Country: INDONESIA
                        </div>
                     </div>

                     <div className="grid grid-cols-[1.5fr_1fr] gap-4">
                        <div className="border border-black p-3 pt-4 relative min-h-[60px] text-xs font-sans">
                           <div className="text-xs font-bold bg-[#ffffff] print-bg px-1 absolute -top-2 left-2">Securities</div>
                           <div>Ref. Code: {meta.refCode}</div>
                           <div>Description: CASH WIRE TRANSFER</div>
                        </div>
                        <div className="border border-black p-2 pt-4 relative bg-[#e0f7fa]/30 print-bg">
                           <div className="text-xs font-bold bg-[#ffffff] print-bg px-1 absolute -top-2 left-2">Progress</div>
                           <div className="text-xs mb-2">Printing done...</div>
                           <div className="flex gap-[2px] h-6 w-3/4">
                              {[...Array(15)].map((_, i) => (
                                 <div key={i} className="flex-1 bg-[#00bcd4] print-bg"></div>
                              ))}
                           </div>
                           <div className="flex justify-center mt-4">
                              <button className="px-6 py-1 bg-[#e0e0e0] border border-gray-400 font-bold shadow text-xs">OK</button>
                           </div>
                        </div>
                     </div>

                     {/* Stamps and Signature Container */}
                     <div className="absolute top-[320px] right-[50px] z-30 pointer-events-none transform scale-[0.6]">
                        {/* Circular Stamp */}
                        <div className="absolute -top-[35px] -right-[72px] w-36 h-36 flex items-center justify-center opacity-85 z-10 -rotate-[15deg]">
                           <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
                              <path id="circlePath" d="M 10, 50 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                              <path id="circlePathBottom" d="M 10, 50 a 40,40 0 0,0 80,0" fill="none" />
                              <text className="text-[9.5px] font-bold font-sans fill-[#0018a8] tracking-widest">
                                 <textPath href="#circlePath" startOffset="11%">
                                    DEUTSCHE BANK AG FRANKFURT ★
                                 </textPath>
                              </text>
                              <text className="text-[7.5px] font-bold font-sans fill-[#0018a8] tracking-widest">
                                 <textPath href="#circlePathBottom" startOffset="50%" textAnchor="middle">
                                    ★ 000 669 67 TEL ★
                                 </textPath>
                              </text>
                              <circle cx="50" cy="50" r="48" fill="none" stroke="#0018a8" strokeWidth="1.5" />
                              <circle cx="50" cy="50" r="32" fill="none" stroke="#0018a8" strokeWidth="0.5" />
                           </svg>
                           <div className="w-10 h-10 border-[2px] border-[#0018a8] relative p-0.5 bg-[#f0f8fb] z-10 print-bg">
                              <div className="w-full h-full bg-[#f0f8fb] border border-[#0018a8] print-bg">
                                 <div className="w-[120%] h-[2px] bg-[#0018a8] origin-bottom-left -rotate-45 absolute bottom-1 left-0.5"></div>
                              </div>
                           </div>
                        </div>

                        {/* Stamp Overlay */}
                        <div className="absolute top-[30px] -right-[45px] w-[340px] h-[140px] border-[3px] border-[#0018a8] text-[#0018a8] -rotate-[16deg] flex flex-col justify-center items-center opacity-85 p-2 print-bg z-20">
                           <div className="text-[10px] font-sans font-bold leading-tight text-center">
                              TAUNUSANLAGE 12, POSTCODE 60262 FRANKFURT AM MAIN, GERMANY
                           </div>
                           <div className="w-full border-b border-[#0018a8] my-1"></div>
                           <div className="flex items-center gap-4 py-1">
                              <div className="w-10 h-10 border-[2px] border-[#0018a8] relative p-1 bg-[#f0f8fb] shrink-0 print-bg">
                                 <div className="w-full h-full bg-[#f0f8fb] border border-[#0018a8] print-bg">
                                    <div className="w-[120%] h-[2px] bg-[#0018a8] origin-bottom-left -rotate-45 absolute bottom-1 left-0.5"></div>
                                 </div>
                              </div>
                              <div className="text-3xl font-sans font-black tracking-tighter">Deutsche Bank</div>
                           </div>
                           <div className="w-full border-t border-[#0018a8] my-1"></div>
                           <div className="flex justify-between w-full text-[10px] font-bold font-sans">
                              <span>Tel +496991000</span>
                              <span>Fax +496991034225</span>
                           </div>
                        </div>

                        {/* Signature */}
                        <div className="absolute -top-[15px] -right-[50px] text-[#0018a8] text-[26px] opacity-90 transform -rotate-[20deg] z-30 tracking-tighter whitespace-nowrap" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                           MR. CARSTEN LEWERENZ
                        </div>
                     </div>
                  </div>
                  </div>
                  </div>
                  <div className="w-full h-16 bg-[#312571] print-bg mt-auto shrink-0"></div>
               </div>
            </div>

            {/* PAGE 4 */}
            <div className="print-page-wrapper w-[1050px] bg-white print:bg-white text-black relative text-sm font-sans shadow-2xl print:shadow-none overflow-hidden print-bg" style={{ minHeight: '750px' }}>
               <div className="print-landscape-content w-full relative p-10 bg-white print-bg" style={{ minHeight: '1050px' }}>
                  <div className="relative z-10 w-full h-full flex flex-col">
                  <div className="flex justify-end items-start mb-2">
                     <div className="text-right text-[#0018a8] flex flex-col items-end">
                        <div className="flex items-center gap-3">
                           <h1 className="text-5xl font-sans font-bold tracking-tight">Deutsche Bank</h1>
                           <div className="w-12 h-12 border-[4px] border-[#0018a8] relative p-1 bg-[#0018a8] print-bg">
                              <div className="w-full h-full bg-[#0018a8] border border-white relative print-bg">
                                 <div className="w-[140%] h-[4px] bg-white origin-bottom-left -rotate-45 absolute bottom-1 left-0.5 print-bg"></div>
                              </div>
                           </div>
                        </div>
                        <h2 className="text-sm font-sans font-bold mt-1">Deutsche Bank AG</h2>
                     </div>
                  </div>

                  <div className="flex justify-end text-[11px] mb-6">
                     <div className="text-right">
                        SWIFT BIC: {institution.swiftCode}<br />
                        <a href="https://www.db.com" className="text-[#0018a8] underline font-bold">www.db.com</a>
                     </div>
                  </div>

                  <div className="flex justify-between text-[12.5px] mb-6 leading-relaxed">
                     <div>
                        To: {institution.accountName}<br />
                        Address: {institution.address}<br /><br />
                        Attn: {institution.signatory}
                     </div>
                     <div className="text-right">
                        Date: {postDateFormatted}<br />
                        Transfer Reference No: {transaction.senderReference}
                     </div>
                  </div>

                  <div className="w-full relative z-20">
                     <table className="w-full border-collapse border border-black text-[11.5px] text-center">
                        <thead>
                           <tr className="bg-[#d2dce6] print-bg border-b border-black">
                              <th className="border-r border-black py-1.5 px-2 font-normal text-left" colSpan={3}>Account Holder:</th>
                              <th className="py-1.5 px-2 font-normal text-left" colSpan={4}>Account Signatory:</th>
                           </tr>
                           <tr className="bg-transparent border-b border-black">
                              <td className="border-r border-black py-1.5 px-2 font-bold text-left underline" colSpan={3}>{institution.accountName}</td>
                              <td className="py-1.5 px-2 font-bold text-left underline" colSpan={4}>{institution.signatory}</td>
                           </tr>
                           <tr className="bg-[#d2dce6] print-bg font-bold border-b border-black">
                              <th className="border-r border-black py-1.5 px-2 font-normal">Type</th>
                              <th className="border-r border-black py-1.5 px-2 font-normal">Account Number</th>
                              <th className="border-r border-black py-1.5 px-2 font-normal">Currency</th>
                              <th className="border-r border-black py-1.5 px-2 font-normal">Date</th>
                              <th className="border-r border-black py-1.5 px-2 font-normal">Debit</th>
                              <th className="border-r border-black py-1.5 px-2 font-normal">Credit</th>
                              <th className="py-1.5 px-2 font-normal text-center">Beneficiary</th>
                           </tr>
                        </thead>
                        <tbody className="bg-transparent border-b border-black">
                           <tr>
                              <td className="border-r border-black py-4 px-2 font-bold">Corporate</td>
                              <td className="border-r border-black py-4 px-2">{institution.accountNumber}</td>
                              <td className="border-r border-black py-4 px-2">{transaction.currency}</td>
                              <td className="border-r border-black py-4 px-2">{postDateFormatted}</td>
                              <td className="border-r border-black py-4 px-2 text-right">{formatNumber(transaction.amount)}</td>
                              <td className="border-r border-black py-4 px-2"></td>
                              <td className="py-2 px-4 text-left text-[10px] leading-tight w-[30%]">
                                 Bank Name: {beneficiary.bankName}<br />
                                 Account name: {beneficiary.accountName}<br />
                                 Account number: {beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}<br />
                                 SWIFT CODE: {beneficiary.swiftCode}
                              </td>
                           </tr>
                           <tr className="bg-[#d2dce6] print-bg">
                              <td colSpan={7} className="py-1 text-center font-bold">SWIFT Transmission / Additional Fee: {transaction.swiftFee}</td>
                           </tr>
                        </tbody>
                     </table>
                     
                     <table className="w-full border-collapse border-l border-r border-b border-black text-[11.5px] text-center mb-4">
                        <thead className="bg-[#d2dce6] print-bg border-t border-b border-black">
                           <tr>
                              <th className="border-r border-black py-1.5 px-2 font-normal w-[12%]">Date</th>
                              <th className="border-r border-black py-1.5 px-2 font-normal w-[22%]">Previous Balance / Euro</th>
                              <th className="border-r border-black py-1.5 px-2 font-normal w-[22%]">Debit</th>
                              <th className="border-r border-black py-1.5 px-2 font-normal w-[15%]">Authority</th>
                              <th className="py-1.5 px-2 font-normal">Current Balance / Euro</th>
                           </tr>
                        </thead>
                        <tbody className="bg-transparent text-[11px]">
                           <tr className="border-b border-black">
                              <td className="border-r border-black py-1 px-2 text-center">{postDateFormatted}</td>
                              <td className="border-r border-black py-1 px-2 text-right">{formatNumber(transaction.previousBalance)}</td>
                              <td className="border-r border-black py-1 px-2 text-right">{formatNumber(transaction.amount)}</td>
                              <td className="border-r border-black py-1 px-2 text-center">CASH WIRE</td>
                              <td className="py-1 px-2 text-right font-bold underline">{formatNumber(transaction.currentBalance)}</td>
                           </tr>
                           <tr>
                              <td className="border-r border-black py-1 px-2 text-center">{postDateFormatted}</td>
                              <td className="border-r border-black py-1 px-2 text-right">{formatNumber(transaction.previousBalance)}</td>
                              <td className="border-r border-black py-1 px-2 text-right">{formatNumber(transaction.senderCharges)}</td>
                              <td className="border-r border-black py-1 px-2 text-center">Additional Fee</td>
                              <td className="py-1 px-2 text-right">{formatNumber(transaction.previousBalance)}</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  {/* Signatures Image */}
                  <div className="w-full relative flex justify-center mt-2 mb-2 z-30 opacity-90">
                     <img src="/images/page4_stamps_v2.png" alt="Signatures and Stamps" className="w-[85%] object-contain mix-blend-multiply" />
                  </div>
               </div>
               </div>
            </div>

            {/* PAGE 5 */}
            <div className="print-page-wrapper w-[1050px] bg-white print:bg-white text-black relative text-sm font-sans shadow-2xl print:shadow-none overflow-hidden print-bg" style={{ minHeight: '750px' }}>
               <div className="print-landscape-content w-full relative p-10 bg-white print-bg flex flex-col justify-between" style={{ minHeight: '1050px' }}>
                  <div className="relative z-10 w-full h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                     <div className="text-[#0018a8]">
                        <h1 className="text-[40px] font-sans font-bold tracking-tight">Deutsche Bank</h1>
                        <h2 className="text-[22px] font-sans text-[#0081a8] tracking-normal mt-1">Global Transaction Banking</h2>
                     </div>
                     <div className="w-[72px] h-[72px] border-[5px] border-[#0018a8] relative p-1 bg-[#0018a8] print-bg mr-4">
                        <div className="w-full h-full bg-[#0018a8] border border-white relative print-bg">
                           <div className="w-[140%] h-[3.5px] bg-white origin-bottom-left -rotate-45 absolute bottom-0.5 left-0.5 print-bg"></div>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between text-[11px] mb-8 leading-tight">
                     <div className="space-y-1">
                        <div>Date: {postDateFormatted}</div>
                        <div className="mt-3">Sender:</div>
                        <div>{institution.accountName}</div>
                        <div>{institution.address}</div>
                        <div className="mt-1">IBAN:{institution.accountNumber}</div>
                     </div>
                     <div className="text-right text-[10px] mr-24">
                        <div className="font-bold">Deutsche Bank AG</div>
                        <div className="mt-1">Taunusalange 12, 60325 Frankfurt am Main</div>
                     </div>
                  </div>

                  <div className="text-center font-bold text-base mb-8 tracking-wider">
                     REMITTANCE ADVICE
                  </div>

                  <div className="flex gap-4 text-[10px] font-bold mb-6 uppercase">
                     <div>ACCOUNT HOLDER: <span className="font-normal">{institution.accountName}</span></div>
                     <div className="ml-4">ACCOUNT SIGNATORY: <span className="font-normal">{institution.signatory}</span></div>
                  </div>

                  <div className="w-full text-[10px]">
                     <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_2fr] gap-2 font-bold mb-4 uppercase">
                        <div>ACCOUNT TYPE</div>
                        <div className="text-center">ACCOUNT NUMBER</div>
                        <div className="text-center">CURRENCY</div>
                        <div className="text-center">DATE</div>
                        <div className="text-center">AMOUNT</div>
                        <div className="text-center">BENEFICIARY</div>
                     </div>

                     <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_2fr] gap-2 mb-16 items-start">
                        <div>Corporate account<br /><br />{institution.accountName}</div>
                        <div className="text-center"><br /><br />{institution.accountNumber.substring(12)}</div>
                        <div className="text-center uppercase"><br /><br />{transaction.currency}</div>
                        <div className="text-center"><br /><br />{postDateFormatted}</div>
                        <div className="text-center"><br /><br />{formatNumber(transaction.amount)}</div>
                        <div className="text-left pl-8 leading-relaxed">
                           Address: INDONESIA<br /><br />
                           {beneficiary.bankName}<br /><br />
                           Address {beneficiary.address}<br /><br />
                           SWIFT: {beneficiary.swiftCode}<br /><br />
                           ACCOUNT NUMBER: {beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
                        </div>
                     </div>

                     <div className="grid grid-cols-[1fr_2fr_1.5fr_1.5fr_1.5fr] gap-2 font-bold mb-4 uppercase">
                        <div>DATE</div>
                        <div className="text-center">PREV.BALANCE</div>
                        <div className="text-center">AUTHORITY</div>
                        <div className="text-center">AMOUNT</div>
                        <div className="text-center">BALANCE</div>
                     </div>

                     <div className="grid grid-cols-[1fr_2fr_1.5fr_1.5fr_1.5fr] gap-2 items-center mb-8">
                        <div>{postDateFormatted}</div>
                        <div className="text-center">€{formatNumber(transaction.previousBalance)}</div>
                        <div className="text-center">CASH TRANSFER</div>
                        <div className="text-center">€{formatNumber(transaction.amount)}</div>
                        <div className="text-center">€{formatNumber(transaction.currentBalance)}</div>
                     </div>
                  </div>

                  <div className="flex items-end mt-8 text-[11px] w-full pl-[5%] relative">
                     <div className="z-20 -mb-2 mr-4">
                        <img src="/images/page5_stamp_v2.png" alt="Stamps" className="w-[250px] object-contain mix-blend-multiply opacity-90" />
                     </div>
                     <div className="mb-10 z-10 whitespace-nowrap">Senior Corporate Officer OLE MATTHIESSEN</div>
                  </div>
               </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default DeutschePrintoutV2;
