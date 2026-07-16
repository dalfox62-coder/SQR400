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

const DeutschePrintoutV2 = ({ data, onBack }) => {
   const [baseUrl, setBaseUrl] = useState("https://sqr400-ten.vercel.app");

   useEffect(() => {
      if (typeof window !== "undefined") {
         if (window.location.origin.includes("localhost")) {
            setBaseUrl(window.location.origin);
         }
      }
   }, []);

   const { institution, transaction, beneficiary, meta } = data;
   const postDateFormatted = transaction.valueDate ? new Date(transaction.valueDate).toLocaleDateString("en-GB").replace(/\//g, ".") : "30.06.2025";
   const postTime = transaction.postTime || "11:49:54";

   const generateMT103Text = (isPage2 = false) => {
      return `MONDAY, JUNE 30, 2025 11:49:54
INTERNATIONAL SWIFT MT103 ACKS-3006-2025-1 CUSTOMER'S COPY ${institution.address}
${isPage2 ? "          INSTANT TYPE, AND TRANSMISSION" : "-------------------------------INSTANT TYPE, AND TRANSMISSION"}
/ User: ${meta.user}
/ Document History: ${meta.documentHistory}
/ Post Date: ${postDateFormatted} ${postTime}
/ Message Type/Type: MT103 CASH WIRE TRANSFER
/ Message Reference: ${transaction.senderReference}
/ SENDER: ${institution.swiftCode}
/ BANK NAME: ${institution.bankName}
/ BANK ADDRESS: ${institution.address}
/ BANK ACCOUNT NAME: ${institution.accountName}
/ BANK ACCOUNT NO: ${institution.accountNumber}
/ RECEIVER: ${beneficiary.swiftCode}
/ BANK NAME: ${beneficiary.bankName}
/ BANK ADDRESS: ${beneficiary.address}
/ ACCOUNT NAME: ${beneficiary.accountName}
/ ACCOUNT/SORT NUMBER: ${beneficiary.accountNumber}
/ Session Number: ${transaction.sessionNumber}
/ Message Number: ${transaction.messageNumber}
${isPage2 ? "" : "-------------------------------------MESSAGE TEXT-------------------------"}
:20: Sender's Reference
/ ${transaction.senderReference}
:21: Transaction Code
/ ${transaction.transactionCode}
:23B: Bank Operation Code
/ ${transaction.bankOperationCode}
:32A: Value Date/ Currency/Interbank Settled Amount
/ ${postDateFormatted}
/ ${transaction.currency}
/ ${formatNumber(transaction.amount)}
:33B: Currency/Instructed Amount
/ ${transaction.currency}
/ ${formatNumber(transaction.instructedAmount)}
:50F: Ordering Customer-Name & Address
0/ ${institution.accountNumber}
1/ ${institution.accountName}
2/ ${institution.address?.split(',')[0] || ''}
3/ ${institution.country || 'GERMANY'}
4/ ${institution.swiftCode}
:57A: Account with Institution
/ ${beneficiary.swiftCode}
/ ${beneficiary.bankName}
/ ${beneficiary.address}
:59: Beneficiary Customer
/ ${beneficiary.accountNumber}
/ ${beneficiary.accountName}
:70: Remittance Information
${transaction.remittanceInfo.split('\n').map(line => `/ ${line}`).join('\n')}
:71A: Details of Charges
/ ${transaction.charges}
:71F: Sender's Charges
/ ${transaction.currency}
/ ${formatNumber(transaction.senderCharges)}
`;
   };

   return (
      <div translate="no" className="notranslate bg-gray-200 min-h-screen pb-10">
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
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          @page {
            size: A4 portrait;
          }
          @page landscape-page {
            size: A4 landscape;
          }
          .page-landscape {
            page: landscape-page;
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
         <div className="max-w-5xl mx-auto pt-6 px-4 mb-6 flex flex-wrap justify-between gap-3 no-print">
            <button onClick={onBack} className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold transition text-base text-gray-800">
               ← Back to Form
            </button>
            <button onClick={() => window.print()} className="px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white rounded-lg font-semibold transition text-base shadow-md">
               🖨️ Print Document (5 Pages)
            </button>
         </div>

         <div id="printable-area" className="w-full mx-auto printable-container flex flex-col gap-8 print:gap-0 items-center">

            {/* PAGE 1 */}
            <div className="w-[210mm] p-10 page-break bg-white text-black relative shadow-2xl print:shadow-none" style={{ minHeight: '297mm' }}>

               {/* Vertical Barcode on the right edge */}
               <div className="absolute right-0 top-[220px] w-0 h-0">
                  <div className="transform rotate-90 origin-top-left flex flex-col items-center gap-1 w-[350px]">
                     <div className="font-mono text-[11px] tracking-[0.2em]">{transaction.senderReference}</div>
                     <img src="/logos/deutsche-barcode.png" alt="Barcode" className="h-[35px] w-[350px] object-fill mix-blend-multiply" />
                  </div>
               </div>

               <div className="flex justify-between items-start mb-6">
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
                     <div className="mt-4 font-bold text-lg underline"><a href="https://www.deutsche-bank.de">https://www.deutsche-bank.de</a></div>
                  </div>
               </div>

               <div className="font-mono text-[10.5px] leading-snug whitespace-pre-wrap text-black">
                  {generateMT103Text(false)}
               </div>
               <div className="mt-8 flex justify-end">
                  <div className="pr-4 shrink-0">
                     <QRCode
                        value={data.slug ? `${baseUrl}/doc/${data.slug}` : "https://sqr400-ten.vercel.app/"}
                        size={100}
                        level="H"
                        fgColor="#000000"
                        bgColor="#FFFFFF"
                        className="mix-blend-multiply"
                     />
                  </div>
               </div>
            </div>

            {/* PAGE 2 */}
            <div className="w-[210mm] p-10 page-break bg-black text-gray-200 print-bg shadow-2xl print:shadow-none" style={{ minHeight: '297mm', backgroundColor: 'black' }}>
               <div className="flex justify-between items-start mb-6 bg-black p-4 print-bg" style={{ backgroundColor: 'black' }}>
                  <div className="text-blue-600">
                     <h1 className="text-3xl font-sans tracking-tight">Deutsche Bank</h1>
                     <h2 className="text-xl font-sans text-blue-400">OnlineBanking & Brokerage</h2>
                  </div>
                  <div className="text-right text-blue-600 flex flex-col items-end">
                     <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-sans font-bold tracking-tight">Deutsche Bank</h1>
                        <div className="w-10 h-10 border-[3px] border-blue-600 relative p-1">
                           <div className="w-full h-full bg-black border border-blue-600">
                              <div className="w-[120%] h-[3px] bg-blue-600 origin-bottom-left -rotate-45 absolute bottom-1.5 left-1"></div>
                           </div>
                        </div>
                     </div>
                     <h2 className="text-lg font-sans">Aktiengesellschaft</h2>
                     <div className="mt-4 font-bold text-lg"><a href="https://www.deutsche-bank.de">https://www.deutsche-bank.de</a></div>
                  </div>
               </div>

               <div className="font-mono text-[10.5px] leading-snug whitespace-pre-wrap text-gray-300">
                  {generateMT103Text(true)}
               </div>
            </div>

            {/* PAGE 3 */}
            <div className="w-[297mm] page-break page-landscape bg-[#f0f8fb] text-black relative shadow-2xl print:shadow-none print-bg" style={{ minHeight: '210mm' }}>
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
                           Account No.: {beneficiary.accountNumber}
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

                     {/* Circular Stamp */}
                     <div className="absolute top-[215px] -right-[72px] w-36 h-36 flex items-center justify-center opacity-85 z-10 -rotate-[15deg] pointer-events-none">
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
                     <div className="absolute top-[280px] -right-[15px] w-[340px] h-[140px] border-[3px] border-[#0018a8] text-[#0018a8] -rotate-[16deg] flex flex-col justify-center items-center opacity-85 pointer-events-none p-2 print-bg z-20">
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
                     <div className="absolute top-[235px] -right-[20px] text-[#0018a8] text-[40px] opacity-90 transform -rotate-[20deg] z-30 pointer-events-none tracking-tighter" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                        Christian Sewing
                     </div>
                  </div>
               </div>

               <div className="absolute bottom-0 w-full h-16 bg-[#312571] print-bg"></div>
            </div>

            {/* PAGE 4 */}
            <div className="w-[297mm] p-10 page-break page-landscape bg-[#e8edf2] text-black relative text-sm font-sans shadow-2xl print:shadow-none overflow-hidden print-bg" style={{ minHeight: '210mm' }}>
               {/* Background repeating text */}
               <div className="absolute inset-0 flex flex-wrap text-[#d0d7e0] text-[13px] leading-[1.2] font-sans font-bold opacity-70 select-none z-0 print-bg overflow-hidden" style={{ wordBreak: 'break-all' }}>
                  {Array(2500).fill('Deutsche Bank ').join('')}
               </div>

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
                     <table className="w-full border-collapse border border-gray-500 text-[11.5px] text-center bg-white/70 print-bg mb-4">
                        <thead>
                           <tr className="bg-[#d2dce6] print-bg border-b border-gray-500">
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal text-left" colSpan={3}>Account Holder:</th>
                              <th className="py-1.5 px-2 font-normal text-left" colSpan={4}>Account Signatory:</th>
                           </tr>
                           <tr className="bg-[#eef3f7] print-bg border-b border-gray-500">
                              <td className="border-r border-gray-500 py-1.5 px-2 font-bold text-left underline" colSpan={3}>{institution.accountName}</td>
                              <td className="py-1.5 px-2 font-bold text-left underline" colSpan={4}>{institution.signatory}</td>
                           </tr>
                           <tr className="bg-[#d2dce6] print-bg font-bold border-b border-gray-500">
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal">Type</th>
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal">Account Number</th>
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal">Currency</th>
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal">Date</th>
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal">Debit</th>
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal">Credit</th>
                              <th className="py-1.5 px-2 font-normal text-center">Beneficiary</th>
                           </tr>
                        </thead>
                        <tbody className="bg-[#eef3f7] print-bg border-b border-gray-500">
                           <tr>
                              <td className="border-r border-gray-500 py-4 px-2 font-bold">Corporate</td>
                              <td className="border-r border-gray-500 py-4 px-2">{institution.accountNumber}</td>
                              <td className="border-r border-gray-500 py-4 px-2">{transaction.currency}</td>
                              <td className="border-r border-gray-500 py-4 px-2">{postDateFormatted}</td>
                              <td className="border-r border-gray-500 py-4 px-2 text-right">{formatNumber(transaction.amount)}</td>
                              <td className="border-r border-gray-500 py-4 px-2"></td>
                              <td className="py-2 px-4 text-left text-[10px] leading-tight w-[30%]">
                                 Bank Name: {beneficiary.bankName}<br />
                                 Account name: {beneficiary.accountName}<br />
                                 Account number: {beneficiary.accountNumber}<br />
                                 SWIFT CODE: {beneficiary.swiftCode}
                              </td>
                           </tr>
                           <tr className="bg-[#d2dce6] print-bg border-b border-gray-500">
                              <td colSpan={7} className="py-1 text-center font-bold">SWIFT Transmission / Additional Fee: {transaction.swiftFee}</td>
                           </tr>
                        </tbody>
                        <thead className="bg-[#d2dce6] print-bg border-b border-gray-500">
                           <tr>
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal w-[12%]">Date</th>
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal w-[22%]">Previous Balance / Euro</th>
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal w-[22%]">Debit</th>
                              <th className="border-r border-gray-500 py-1.5 px-2 font-normal w-[15%]">Authority</th>
                              <th className="py-1.5 px-2 font-normal">Current Balance / Euro</th>
                           </tr>
                        </thead>
                        <tbody className="bg-[#eef3f7] print-bg text-[11px]">
                           <tr className="border-b border-gray-500">
                              <td className="border-r border-gray-500 py-1 px-2 text-center">{postDateFormatted}</td>
                              <td className="border-r border-gray-500 py-1 px-2 text-right">{formatNumber(transaction.previousBalance)}</td>
                              <td className="border-r border-gray-500 py-1 px-2 text-right">{formatNumber(transaction.amount)}</td>
                              <td className="border-r border-gray-500 py-1 px-2 text-center">CASH WIRE</td>
                              <td className="py-1 px-2 text-right font-bold underline">{formatNumber(transaction.currentBalance)}</td>
                           </tr>
                           <tr>
                              <td className="border-r border-gray-500 py-1 px-2 text-center">{postDateFormatted}</td>
                              <td className="border-r border-gray-500 py-1 px-2 text-right">{formatNumber(transaction.previousBalance)}</td>
                              <td className="border-r border-gray-500 py-1 px-2 text-right">{formatNumber(transaction.senderCharges)}</td>
                              <td className="border-r border-gray-500 py-1 px-2 text-center">Additional Fee</td>
                              <td className="py-1 px-2 text-right">{formatNumber(transaction.previousBalance)}</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  {/* Signatures using Absolute Positioning based on Table Columns for perfect alignment */}
                  <div className="w-full relative h-40 mt-4 z-30">
                     
                     {/* Circular Stamp (Centered around 16% width, under Date & Prev Balance) */}
                     <div className="absolute left-[16%] top-2 opacity-85 -translate-x-1/2">
                        <svg viewBox="0 0 100 100" className="w-[125px] h-[125px] -rotate-[10deg]">
                           <path id="circlePath4" d="M 10, 50 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                           <text className="text-[10px] font-bold font-sans fill-[#0018a8] tracking-widest">
                              <textPath href="#circlePath4" startOffset="10%">DEUTSCHE BANK AG</textPath>
                           </text>
                           <text className="text-[10px] font-bold font-sans fill-[#0018a8] tracking-widest">
                              <textPath href="#circlePath4" startOffset="55%">FRANKFURT AM MAIN</textPath>
                           </text>
                           <circle cx="50" cy="50" r="48" fill="none" stroke="#0018a8" strokeWidth="1.5" />
                           <circle cx="50" cy="50" r="32" fill="none" stroke="#0018a8" strokeWidth="0.5" />
                        </svg>
                        <div className="w-7 h-7 border-[1.5px] border-[#0018a8] absolute top-[48.5px] left-[48.5px] p-[1px] bg-transparent">
                           <div className="w-full h-full border border-[#0018a8] relative overflow-hidden">
                              <div className="w-[140%] h-[1.5px] bg-[#0018a8] origin-bottom-left -rotate-45 absolute bottom-0 left-0"></div>
                           </div>
                        </div>
                     </div>

                     {/* James Signature (Overlapping Stamp) */}
                     <div className="text-[34px] text-[#0018a8] absolute left-[15%] top-0 -translate-x-1/2 -rotate-[15deg] whitespace-nowrap z-40" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                        James
                     </div>

                     {/* James Printed Text (To the right of the stamp, starting at 24% width) */}
                     <div className="absolute left-[24%] top-14 text-[9.5px] font-bold leading-[1.3] text-[#0018a8] text-left z-20">
                        JAMES VON MOLTKE(78414M)<br />
                        MANAGING DIRECTOR<br />
                        FOR AND BEHALF<br />
                        DEUTSCHE BANK AG
                     </div>

                     {/* Rectangular Stamp (Centered around 56% width, under Authority) */}
                     <div className="absolute left-[56%] top-6 opacity-85 -translate-x-1/2 z-10">
                        <div className="border-[2px] border-[#0018a8] p-1.5 text-[8px] text-[#0018a8] font-normal leading-tight w-[260px] bg-[#e8edf2] print-bg">
                           TAUNUSANLAGE 12, 60325 FRANKFURT AM MAIN, GERMANY<br />
                           <div className="flex justify-between items-center mt-1 border-t border-[#0018a8] pt-1">
                              <span className="font-bold text-sm">Deutsche Bank</span>
                              <div className="w-5 h-5 border border-[#0018a8] p-[1.5px]">
                                 <div className="w-full h-full bg-[#0018a8] border border-[#0018a8] relative print-bg">
                                    <div className="w-[140%] h-[1.5px] bg-white origin-bottom-left -rotate-45 absolute bottom-0.5 left-0 print-bg"></div>
                                 </div>
                              </div>
                           </div>
                           <div className="flex justify-between text-[6px] mt-1 border-t border-[#0018a8] pt-0.5">
                              <span>Tel: +49 69 910-00</span>
                              <span>Fax: +49 69 910-34 225</span>
                           </div>
                        </div>
                     </div>

                     {/* Christian Sewing Signature (Overlapping Printed Text) */}
                     <div className="text-[32px] text-[#0018a8] absolute left-[77%] top-0 -translate-x-1/2 -rotate-[18deg] whitespace-nowrap z-40" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                        Christian Sewing
                     </div>

                     {/* Christian Sewing Printed Text (To the right of the stamp, starting at 70% width) */}
                     <div className="absolute left-[70%] top-12 text-[10px] font-bold leading-[1.3] text-[#0018a8] text-left z-20">
                        MR. CHRISTIAN SEWING (9089)<br />
                        FOR AND ON BEHALF OF<br />
                        DEUTSCHE BANK AG
                     </div>
                     
                  </div>
               </div>
            </div>

            {/* PAGE 5 */}
            <div className="w-[210mm] p-10 page-break bg-white text-black text-sm font-sans shadow-2xl print:shadow-none print:m-0" style={{ minHeight: '297mm' }}>
               <div className="flex justify-between items-start mb-12">
                  <div className="text-[#0018a8]">
                     <h1 className="text-3xl font-sans font-bold tracking-tight">Deutsche Bank</h1>
                     <h2 className="text-xl font-sans text-cyan-600 font-semibold tracking-tight">Global Transaction Banking</h2>
                  </div>
                  <div className="w-48 h-16 bg-cover bg-center overflow-hidden flex justify-center">
                     <svg viewBox="0 0 100 20" className="h-10 w-full mt-2" preserveAspectRatio="none">
                        <path d="M0,0 h1 v20 h-1 z M2,0 h2 v20 h-2 z M5,0 h1 v20 h-1 z M7,0 h3 v20 h-3 z M12,0 h2 v20 h-2 z M15,0 h1 v20 h-1 z M17,0 h4 v20 h-4 z M22,0 h1 v20 h-1 z M24,0 h2 v20 h-2 z M28,0 h1 v20 h-1 z M30,0 h3 v20 h-3 z M35,0 h1 v20 h-1 z M38,0 h2 v20 h-2 z M41,0 h4 v20 h-4 z M46,0 h1 v20 h-1 z M49,0 h2 v20 h-2 z M52,0 h1 v20 h-1 z M55,0 h3 v20 h-3 z M59,0 h2 v20 h-2 z M62,0 h1 v20 h-1 z M65,0 h1 v20 h-1 z M68,0 h2 v20 h-2 z M72,0 h1 v20 h-1 z M75,0 h3 v20 h-3 z M79,0 h2 v20 h-2 z M83,0 h1 v20 h-1 z M86,0 h3 v20 h-3 z M91,0 h1 v20 h-1 z M94,0 h4 v20 h-4 z" fill="black" />
                     </svg>
                  </div>
                  <div className="w-24 h-24 border-[6px] border-[#0018a8] relative p-1.5 bg-[#0018a8] print-bg">
                     <div className="w-full h-full bg-[#0018a8] border border-white relative print-bg">
                        <div className="w-[140%] h-[6px] bg-white origin-bottom-left -rotate-45 absolute bottom-1.5 left-0.5 print-bg"></div>
                     </div>
                  </div>
               </div>

               <div className="flex justify-between text-xs mb-16">
                  <div className="space-y-1">
                     <div>Date: {postDateFormatted}</div>
                     <div className="mt-4 mb-2">Sender:</div>
                     <div>{institution.accountName}</div>
                     <div>{institution.address}</div>
                     <div className="mt-2">IBAN:{institution.accountNumber}</div>
                  </div>
                  <div className="text-right">
                     <div>Deutsche Bank AG</div>
                     <div>{institution.address}</div>
                  </div>
               </div>

               <div className="text-center font-bold text-lg mb-8 tracking-wider">
                  REMITTANCE ADVICE
               </div>

               <div className="flex gap-4 text-xs font-bold mb-6 uppercase">
                  <div>ACCOUNT HOLDER: {institution.accountName}</div>
                  <div>ACCOUNT SIGNATORY: {institution.signatory}</div>
               </div>

               <div className="text-xs w-full">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_2fr] gap-2 font-bold mb-6 border-b border-white pb-2">
                     <div>ACCOUNT TYPE</div>
                     <div>ACCOUNT NUMBER</div>
                     <div className="text-center">CURRENCY</div>
                     <div className="text-center">DATE</div>
                     <div className="text-right">AMOUNT</div>
                     <div className="text-center">BENEFICIARY</div>
                  </div>

                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_2fr] gap-2 mb-16 items-start">
                     <div>Corporate account<br /><br />{institution.accountName}</div>
                     <div><br /><br />{institution.accountNumber.substring(12)}</div>
                     <div className="text-center"><br /><br />{transaction.currency}</div>
                     <div className="text-center"><br /><br />{postDateFormatted}</div>
                     <div className="text-right"><br /><br />{formatNumber(transaction.amount)}</div>
                     <div className="text-left pl-4 leading-relaxed">
                        <br /><br />
                        Address: INDONESIA<br /><br />
                        {beneficiary.bankName}<br />
                        Address {beneficiary.address}<br /><br />
                        SWIFT: {beneficiary.swiftCode}<br />
                        ACCOUNT NUMBER: {beneficiary.accountNumber}
                     </div>
                  </div>

                  <div className="grid grid-cols-[1fr_2fr_2fr_2fr_2fr] gap-2 font-bold mb-6 uppercase text-[11px]">
                     <div>DATE</div>
                     <div>PREV.BALANCE</div>
                     <div className="text-center">AUTHORITY</div>
                     <div className="text-right">AMOUNT</div>
                     <div className="text-right">BALANCE</div>
                  </div>

                  <div className="grid grid-cols-[1fr_2fr_2fr_2fr_2fr] gap-2 text-sm mb-16 items-center">
                     <div>{postDateFormatted}</div>
                     <div>€{formatNumber(transaction.previousBalance)}</div>
                     <div className="text-center">CASH TRANSFER</div>
                     <div className="text-right">€{formatNumber(transaction.amount)}</div>
                     <div className="text-right">€{formatNumber(transaction.currentBalance)}</div>
                  </div>
               </div>

               <div className="flex justify-between items-end mt-20 text-xs">
                  <div>Senior Corporate Officer OLE MATTHIESSEN</div>
                  <div className="relative">
                     <div className="border border-[#7fb3d5] p-2 text-[10px] text-[#2874a6] w-64 absolute bottom-0 right-32 z-0 bg-white">
                        <div className="mb-2 border-b border-[#7fb3d5] pb-1">Deutsche Bank AG Frankfurt AM Main, Taunusanlage-12, 6325</div>
                        <div className="flex items-center gap-2 mb-2 font-bold text-lg">
                           Deutsche Bank
                           <div className="w-5 h-5 border border-[#2874a6] p-0.5">
                              <div className="w-full h-full bg-[#2874a6]">
                                 <div className="w-[120%] h-[1px] bg-white origin-bottom-left -rotate-45 absolute bottom-1 left-0.5"></div>
                              </div>
                           </div>
                        </div>
                        <div className="text-center font-bold">Tel.: 496991000 - Fax: +496991034225</div>
                     </div>
                     <div className="text-5xl text-[#1f618d] absolute -top-8 right-20 transform -rotate-12 whitespace-nowrap z-10" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                        O Matih
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default DeutschePrintoutV2;
