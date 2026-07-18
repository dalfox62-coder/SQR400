import re

with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Extract from 'const generateMT103Text' to '};'
# We need to replace the entire generateMT103Text block.
match = re.search(r'const generateMT103Text = \(isPage2 = false\) => \{.*?^\s*\};\n', code, re.MULTILINE | re.DOTALL)

if match:
    old_block = match.group(0)
else:
    print("Could not find generateMT103Text")
    exit(1)

new_block = """   const formatNumber = (num) => {
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
"""

code = code.replace(old_block, new_block)

with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Successfully replaced generateMT103Text in DeutschePrintoutV2.tsx')
