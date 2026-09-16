"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import QRCode from "react-qr-code";

const formatNumber = (numStr: any) => {
   if (!numStr) return "";
   const num = parseFloat(numStr.replace(/,/g, ""));
   if (isNaN(num)) return numStr;
   return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatAmountStr = (amount: any, currency: any) => {
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
   let postDateFormatted = transaction.valueDate ? new Date(transaction.valueDate).toLocaleDateString("en-GB").replace(/\//g, ".") : "30.06.2025";
   if (transaction.settlementDate) {
      postDateFormatted = transaction.settlementDate;
   }
   const postTime = transaction.postTime || "11:49:54";

   
   let topHeaderDate = transaction.valueDate 
      ? new Date(transaction.valueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() 
      : "MONDAY, JUNE 30, 2025";
   if (transaction.topHeaderDate) {
      topHeaderDate = transaction.topHeaderDate.toUpperCase();
   }
   
   const acksDateStr = transaction.valueDate
      ? (() => {
           const d = new Date(transaction.valueDate);
           const day = String(d.getDate()).padStart(2, '0');
           const month = String(d.getMonth() + 1).padStart(2, '0');
           const year = d.getFullYear();
           return `${day}${month}-${year}`;
        })()
      : "3006-2025";

   const generateMT103Text = (isPage2 = false) => {
      return `${topHeaderDate} ${postTime}
INTERNATIONAL SWIFT I/103.202 ACKS-${acksDateStr}-1 CUSTOMER'S COPY ${institution.address}
${isPage2 ? "------------------------------ -INSTANT TYPE, AND TRANSMISSION---------------------------------------" : "-------------------------------INSTANT TYPE, AND TRANSMISSION"}
/ User: ${meta?.user}
/ Document History: ${meta?.documentHistory}
/ Post Date: ${postDateFormatted} ${postTime}
/ Message Type/Type: MT103 CASH WIRE TRANSFER VIA COMMON ACCOUNT
/ Message Reference: ${transaction.messageReference || "DEUTDEFF25210509445214461835"}
/ SENDER: ${institution.swiftCode}
/ BANK NAME: ${institution.bankName}
/ BANK ADDRESS: ${institution.address}
/ BANK ACCOUNT NAME: ${institution.accountName}
/ BANK ACCOUNT NO: ${institution.accountNumber}
/ RECEIVER: ${beneficiary.swiftCode}
/ BANK NAME: ${beneficiary.bankName}
/ BANK ADDRESS: ${beneficiary.address}
/ ACCOUNT NAME: ${beneficiary.accountName}
/ ACCOUNT/SORT NUMBER: ${beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
/ Session Number: ${transaction.sessionNumber || "3476"}
/ Message Number: ${transaction.messageNumber || "987654"}
-------------------------------- TEXT --------------------------------------------------------
:20: Sender's Reference
/ ${transaction.senderReference}
:21: Transaction Code
/ ${transaction.transactionCode}
:23B: Bank Operation Code
/ ${transaction.bankOperationCode || "CASH"}
:32A: Value Date/ Currency/Interbank Settled Amount
/ ${postDateFormatted}
/ ${transaction.currency}
/ ${formatNumber(transaction.amount)}
:33B: Currency/Instructed Amount
/ ${transaction.currency}
/ ${formatNumber(transaction.amount)}
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
/ ${beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
/ ${beneficiary.accountName}
:70: Remittance Information
${transaction.remittanceInfo ? transaction.remittanceInfo.split('\n').map((line: string) => `/ ${line}`).join('\n') : "/ KELL-IN/UEF/MT103/202/1,9B/05-2025"}
:71A: Details of Transaction
/ AGREEMENT NUMBER: ${transaction.remittanceInfo ? transaction.remittanceInfo.split('\n')[0].replace('AGREEMENT NUMBER:', '').trim() : "KELL-IN/UEF/MT103/202/1,9B/05-2025"}
/ AGREEMENT DATE: MAY 19, 2025
:71F: Sender's Charges
/ ${transaction.currency}
/ ${formatNumber(transaction.senderCharges || 798.00)}
------------------------------------------------------------------------------------------------------`;
   };

   const generateMT202Text = () => {
      return `------------------------------------------------------------------------------------------------------------------
ANSWER BACK PAGE CONFIRMATION SYSTEM
/ User: ${meta?.user}
/ Document History: ${meta?.documentHistory}
/ Post Date: ${postDateFormatted} ${postTime}
/ Message Type/Type: MT-202
/ Message Reference: ${transaction.messageReference || "DEUTDEFF25210509445214461835"}
/ SENDER: ${institution.swiftCode}
/ BANK NAME: ${institution.bankName}
/ BANK ADDRESS: ${institution.address}
/ BANK ACCOUNT NAME: ${institution.accountName}
/ BANK ACCOUNT NO: ${institution.accountNumber}
/ RECEIVER: ${beneficiary.swiftCode}
/ BANK NAME: ${beneficiary.bankName}
/ BANK ADDRESS: ${beneficiary.address}
/ ACCOUNT NAME: ${beneficiary.accountName}
/ ACCOUNT/SORT NUMBER: ${beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
/ Session Number: ${transaction.sessionNumber || "3476"}
/ Message Number: ${transaction.messageNumber || "987654"}
------------------------------------------------------------------------------------------------------------------
:20: Sender Reference Number
/ ${transaction.senderReference}
:21: Related Ref
/ ${transaction.senderReference}
:32A: Value Date, Currency Code, Amount
/ ${postDateFormatted}
/ ${transaction.currency}
/ ${formatNumber(transaction.amount)}
:58A: Beneficiary Institution-Bic
/ ${beneficiary.swiftCode}
/ ${beneficiary.bankName}
/ ${beneficiary.address}
:50F: Ordering Customer-Name & Address
0/ ${institution.accountNumber}
1/ ${institution.accountName}
2/ MORGARTENSTRASSE 3, 6003 LUZERN, SWITZERLAND
3/ ${institution.swiftCode}
:59: Beneficiary Customer- Name & Address
0/ ${beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
1/ ${beneficiary.accountName}
2/ 300 DELAWARE AVE, SUITE 210, WILMINGTON, DE19801, USA
3/ ${beneficiary.swiftCode}
------------------------------------------------------------------------------------------------------------------`;
   };

   const generateNetworkDeliveryText = () => {
      const validLines = [
         "02829298 CNT,",
         "071392 RFF-DTM,",
         "08D28270 RFF,",
         "092875 DTM,",
         "0D92020 USB-CTA-COM,",
         "87293 USB,",
         "OD8282 CTA,",
         "OD828291 COM,",
         "071392 ERC-FTX-5G4,",
         "87293 ERC,",
         "0892894 FTX,",
         "09203395 RFF-FTX,",
         "0829396 REF,",
         "0829397 FTX,",
         "02829298 UNT,"
      ];
      
      const indentedValidBlock = validLines.map(line => {
         const dotsNeeded = 61 - line.length - 5;
         return "                    " + line + ".".repeat(Math.max(0, dotsNeeded)) + "VALID";
      }).join('\n');

      return `${indentedValidBlock}

SERVER GLOBAL ID (ORIGIN) : DE0584
SERVER GLOBAL IP  : 100.311.60.2/25/131.340/134 IDENTITY
CODE : 43C DB JS DE 16DEXX
APPLICATION WIRE TRANSFER INTERNATIONAL

NETWORK DELIVERY STATUS       : NETWORK ACK
PRIORITY                      : DELIVERY
URGENT                        : DELIVERED
REMARK                        : OK
AMOUNT                        : €${formatNumber(transaction.amount)}
ORIGIN                        : ${institution.bankName}//${institution.address}
DESTINATION                   : ${beneficiary.bankName}//${beneficiary.address}
SIZE                          : OK
DELIVERED END MESSAGE         : MT103 CASH WIRE TRANSFER VIA COMMON ACCOUNT
MAC                           : AZ0006UZ415IT16
CHK                           : CHK12479643218W019
DATE                          : ${postDateFormatted}
TIME                          : ${postTime}`;
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
            </div>

            {/* PAGE 1-B (MT202) */}
            <div className="print-page-wrapper w-[750px] px-10 py-6 bg-white text-black relative shadow-2xl print:shadow-none" style={{ minHeight: '1050px' }}>
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
                  {generateMT202Text()}
               </div>
            </div>

            {/* PAGE 1-C (Network Delivery) */}
            <div className="print-page-wrapper w-[750px] px-10 py-6 bg-white text-black relative shadow-2xl print:shadow-none" style={{ minHeight: '1050px' }}>
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
                  {generateNetworkDeliveryText()}
               </div>
               <div className="mt-4 flex justify-end">
                  <div className="pr-4 shrink-0">
                     <a href={data.slug ? `${baseUrl}/doc/${data.slug}` : "https://sqr400-ten.vercel.app/"} target="_blank" rel="noopener noreferrer">
                        <QRCode
                           value={data.slug ? `${baseUrl}/doc/${data.slug}` : "https://sqr400-ten.vercel.app/"}
                           size={85}
                           level="H"
                           fgColor="#000000"
                           bgColor="#FFFFFF"
                        />
                     </a>
                  </div>
               </div>
            </div>

             {/* PAGE 2 */}
            <div className="print-page-wrapper w-[750px] px-10 py-6 bg-black text-gray-200 print-bg shadow-2xl print:shadow-none relative" style={{ minHeight: '1050px', backgroundColor: 'black' }}>
               {/* Full Page Background Image */}
               <div className="absolute inset-0 z-0">
                  <img src="/deutsche-v2-bg.jpeg" alt="Deutsche Background" className="w-full h-full object-fill" />
               </div>
               
               <div className="relative z-10 pt-[160px] pl-[15px]">
                  <div className="font-mono text-[11px] leading-[1.15] whitespace-pre-wrap text-white font-semibold tracking-wide">
                     {generateMT103Text(true)}
                  </div>
               </div>
            </div>

            {/* PAGE 3 */}
            <div className="print-page-wrapper w-[750px] px-10 py-6 bg-black text-gray-200 print-bg shadow-2xl print:shadow-none relative" style={{ minHeight: '1050px', backgroundColor: 'black' }}>
               {/* Full Page Background Image */}
               <div className="absolute inset-0 z-0">
                  <img src="/deutsche-v2-bg.jpeg" alt="Deutsche Background" className="w-full h-full object-fill" />
               </div>
               
               <div className="relative z-10 pt-[160px] pl-[15px]">
                  <div className="font-mono text-[11px] leading-[1.15] whitespace-pre-wrap text-white font-semibold tracking-wide">
                     {generateMT202Text()}
                  </div>
               </div>
            </div>

            {/* PAGE 4 (Network Delivery Status) */}
            <div className="print-page-wrapper w-[750px] px-10 py-6 bg-black text-gray-200 print-bg shadow-2xl print:shadow-none relative" style={{ minHeight: '1050px', backgroundColor: 'black' }}>
               {/* Full Page Background Image */}
               <div className="absolute inset-0 z-0">
                  <img src="/deutsche-v2-bg.jpeg" alt="Deutsche Background" className="w-full h-full object-fill" />
               </div>
               
               <div className="relative z-10 pt-[160px] pl-[15px]">
                  <div className="font-mono text-[11px] leading-[1.15] whitespace-pre-wrap text-white font-semibold tracking-wide">
                     {generateNetworkDeliveryText()}
                  </div>
               </div>
            </div>

            {/* PAGE 5 (Landscape Override) */}
            <div className="print-page-wrapper w-[1050px] relative shadow-2xl print:shadow-none print-bg overflow-hidden" style={{ height: '693px' }}>
               <img src="/deutsche-landscape-bg.jpeg" alt="Background" className="absolute inset-0 w-full h-full object-fill z-0" />
               <div className="absolute inset-0 z-10 font-sans text-black whitespace-nowrap tracking-tight">
                  {/* Account Box */}
                  <div className="absolute top-[26.5%] left-[10.5%] text-[11px] leading-tight text-center">
                     {institution.swiftCode}<br/>{institution.accountNumber}
                  </div>
                  
                  {/* Instruction Type Box */}
                  <div className="absolute top-[26.5%] left-[22.5%] text-[11px] leading-tight">
                     MT 103 - Internal Receipt Instruction<br/>Instruction Sub Type: CASH WIRE TRANSFER
                  </div>
                  
                  {/* GBS Screen Box */}
                  <div className="absolute top-[28.5%] left-[59.5%] text-[10px] leading-tight w-[180px] flex justify-between">
                     <span>Indicator: MAT3D</span>
                     <span>Date {postDateFormatted}</span>
                  </div>
                  
                  {/* References Left */}
                  <div className="absolute top-[35.5%] left-[6.5%] text-[11px] leading-[1.4]">
                     References: {transaction.senderReference}<br/>
                     Sender: {institution.bankName}<br/>
                     Account Name: {institution.accountName}
                  </div>
                  
                  {/* References Right */}
                  <div className="absolute top-[34.5%] left-[37%] text-[11px] leading-[1.3]">
                     References: {beneficiary.swiftCode}<br/>
                     Receiver: {beneficiary.accountName}<br/>
                     Client {beneficiary.bankName}<br/>
                     Account No.: {beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber}
                  </div>
                  
                  {/* Status Left */}
                  <div className="absolute top-[47%] left-[7.5%] text-[11px] leading-[1.4]">
                     <div className="flex gap-4">
                        <span className="w-16">Received</span>
                        <span>Amount:</span>
                        <span className="ml-4">{formatNumber(transaction.amount)}</span>
                     </div>
                     <div className="flex gap-4 my-[1px]">
                        <span className="w-16"></span>
                        <span className="underline ml-6">Internal</span>
                        <span className="underline ml-1">External</span>
                     </div>
                     <div className="flex gap-4">
                        <span className="w-16">Currency:</span>
                        <span>{transaction.currency} 1/4</span>
                        <span className="ml-6">Released by:</span>
                     </div>
                     <div className="mt-[6px]">
                        <span className="underline">PARTICIPANT:</span> NOT.MOD
                     </div>
                  </div>
                  
                  {/* User Activity */}
                  <div className="absolute top-[49%] left-[38%] text-[11px] leading-[1.4]">
                     <div className="grid grid-cols-[130px_90px_auto] gap-y-1">
                        <span>Keyed by:</span><span>{postDateFormatted}</span><span className="text-right">09:44:52</span>
                        <span>Cancelled/Modified by:</span><span></span><span></span>
                        <span>Received by:</span><span>{postDateFormatted}</span><span className="text-right">{meta.receivedTime}</span>
                     </div>
                  </div>
                  
                  {/* Status Bottom */}
                  <div className="absolute top-[62.5%] left-[7.5%] text-[11px] w-[310px] flex justify-between">
                     <span>NEW:</span>
                     <span>MTCH/NMAT</span>
                     <span>NAMT.CMIS</span>
                  </div>
                  
                  {/* Recipient Country */}
                  <div className="absolute top-[61.5%] left-[44%] text-[11px]">
                     Recipient Country: {transaction.country || 'GERMANY'}
                  </div>
                  
                  {/* Securities */}
                  <div className="absolute top-[70%] left-[8.5%] text-[11px] leading-relaxed">
                     Ref. Code: {meta.refCode}<br/>
                     Description: CASH WIRE TRANSFER
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default DeutschePrintoutV2;
