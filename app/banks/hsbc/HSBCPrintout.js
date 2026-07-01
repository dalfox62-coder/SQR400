"use client";

import Image from "next/image";

// Barcode generator – produces a Code-128-style visual barcode that matches
// the authentic SWIFT printout PDF dimensions exactly.
const Barcode = ({ value }) => {
  if (!value) return null;

  // Build a binary pattern from the value characters
  let pattern = "101100101011"; // start code
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    const charPattern = ((charCode * 12345) % 4096).toString(2).padStart(12, "0");
    pattern += charPattern.replace(/1/g, "11").replace(/0/g, "0");
  }
  pattern += "11010011011"; // stop code

  const elements = [];
  let x = 0;
  let idx = 0;

  while (idx < pattern.length) {
    let width = 0;
    const currentVal = pattern[idx];
    while (idx < pattern.length && pattern[idx] === currentVal) {
      width += 0.9;
      idx++;
    }
    if (currentVal === "1") {
      elements.push(<rect key={x} x={x} y={0} width={width} height={40} fill="black" />);
    }
    x += width;
  }

  const totalWidth = Math.ceil(x);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <svg width={totalWidth} height="40" style={{ display: "block" }}>
        {elements}
      </svg>
      <span
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "10px",
          fontWeight: "bold",
          letterSpacing: "0.3px",
          color: "black",
          marginTop: "2px",
          textTransform: "uppercase",
          userSelect: "text",
        }}
      >
        {value}
      </span>
    </div>
  );
};

const HSBCPrintout = ({ data, onBack }) => {
  // ── helpers ─────────────────────────────────────────────────────────
  const fmtNum = (n) => {
    if (!n) return "0.00";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(n));
  };

  const fmtDates = (valueDateStr, timeStr) => {
    let d = new Date();
    if (valueDateStr) {
      const p = valueDateStr.split("-");
      if (p.length === 3) d = new Date(+p[0], +p[1] - 1, +p[2]);
    }
    const DN = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    const MN = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    const t = timeStr || "15:30:30";
    return {
      ts: `${dd}/${mm}/${yy}-${t}`,
      long: `${DN[d.getDay()]} ${+dd} ${MN[d.getMonth()]}, ${yy}`,
      ym: `${yy}-${mm}`,
      mShort: MN[d.getMonth()].substring(0, 3),
      dd, mm, yy,
    };
  };

  const ccyName = (c) => {
    const u = c.toUpperCase();
    if (u === "EUR") return "EURO";
    if (u === "USD") return "US DOLLAR";
    if (u === "GBP") return "BRITISH POUND";
    if (u === "IDR") return "INDONESIAN RUPIAH";
    return u;
  };

  const ccySym = (c) => {
    const u = c.toUpperCase();
    if (u === "EUR") return "€";
    if (u === "USD") return "$";
    if (u === "GBP") return "£";
    if (u === "IDR") return "Rp";
    return c;
  };

  // ── data extraction ─────────────────────────────────────────────────
  const inst   = data.institution || {};
  const tx     = data.transaction || {};
  const rcv    = data.receiverBank || {};
  const ben    = data.beneficiary || {};
  const tech   = data.technical || {};

  const dt     = fmtDates(tx.valueDate, tx.transactionTime);
  const amt    = fmtNum(tx.amount);
  const ccy    = (tx.currency || "EUR").toUpperCase();
  const sym    = ccySym(ccy);
  const cn     = ccyName(ccy);

  const sc8    = (inst.swiftCode || "HBUKGB4B").substring(0, 8).toUpperCase();
  const rc8    = (rcv.swiftCode || "BNINIDJA").substring(0, 8).toUpperCase();

  const chg    = (tx.charges || "OUR").toUpperCase();
  const chgFmt = chg === "OUR" ? "OURS" : chg === "BEN" ? "BENEFICIARY" : chg === "SHA" ? "SHARED" : chg;

  const sc4    = sc8.substring(0, 4);
  const suf6   = (tx.senderReference || "HSBC587069248914").slice(-6);
  const track  = (tech.trackCode || `${sc4}${suf6}`).toUpperCase();
  const cipher = (tech.cipher || `PTZH_DETH-${sc4}-${dt.mShort}${dt.dd}-${chg}103`).toUpperCase();
  const xmit   = (tech.transmissionCode || `PRT_TPZH${dt.yy}${dt.mm}${dt.dd}`).toUpperCase();

  // ── formatting helpers ──────────────────────────────────────────────
  const W = 94; // columns
  const dash = (t) => {
    const n = W - t.length;
    return "-".repeat(Math.floor(n/2)) + t + "-".repeat(Math.ceil(n/2));
  };

  // header line 1
  const L1left = dt.ts;
  const L1mid  = `++++++++ ${(inst.bankName || "HSBC UK BANK PLC").toUpperCase()} ++++++++`;
  const L1right= `SWIFT ACKS-8547-${dt.ym}`;
  const midStart = Math.floor(W / 2) - Math.floor(L1mid.length / 2);
  let h1 = L1left.padEnd(midStart) + L1mid;
  h1 = h1.padEnd(W - L1right.length) + L1right;

  // header line 2
  const h2r = "++++++103++";
  const h2 = dt.long.padEnd(W - h2r.length) + h2r;

  // sender / receiver blocks
  const sn = [
    (inst.bankName || "HSBC UK BANK PLC").toUpperCase(),
    (inst.address  || "AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK").toUpperCase(),
    sc8,
  ];
  const rv = [
    (rcv.bankName || "BANK NEGARA INDONESIA - PT (PERSERO)").toUpperCase(),
    (rcv.address  || "BNI BUILDING, FLOOR 7, JALAN JENDERAL SUDIRMAN 1, JAKARTA, INDONESIA").toUpperCase(),
    rc8,
  ];
  const sfmt = "SENDER    : " + sn.join("\n            ");
  const rfmt = "RECEIVER  : " + rv.join("\n            ");

  // ── page 1 text ─────────────────────────────────────────────────────
  const p1 = `${h1}
${h2}
SINGLE CUSTOMER CASH TRANSFER
${"-".repeat(W)}
NOTIFICATION (TRANSMISSION) OF ORIGINAL SENT TO SWIFT WIRE SYSTEM
NETWORK DELIVERY STATUS   : NETWORK ACK

PRIORITY/DELIVERY         : NORMAL/DELIVERY NOTIFICATION
SRC RTE                   : ${(tech.srcRte        || "HBUKGB4BXXX").toUpperCase()}
DEST RTE                  : ${(tech.destRte       || "BNINIDJAXXX").toUpperCase()}
SESSION HEADER            : ${(tech.sessionHeader || "HBUKGB4BXXX").toUpperCase()}
MESSAGE INPUT REFERENCE   : ${(tech.msgInputRef   || "HBUKGB4BXXX75412835942185").toUpperCase()}
MESSAGE OUTPUT REFERENCE  : ${(tech.msgOutputRef  || "BNINIDJAXXX76102436987134").toUpperCase()}
${dash("MESSAGE HEADER")}
${sfmt}
${rfmt}
${dash("MESSAGE TEXT")}
F20: SENDER'S REFERENCE
     ${(tx.senderReference    || "HSBC587069248914").toUpperCase()}
F21: TRANSACTION CODE
     ${(tx.transactionCode    || "HBUKGB4B248914").toUpperCase()}
F23B: BANK OPERATION CODE
      ${(tx.bankOperationCode || "CRED").toUpperCase()}
F32A: VALUE DATE/ CUR / INTERBANK SETTLED AMOUNT
      SAME DAY / ${cn}
      ${sym}${amt}
F33B: CURRENCY / INSTRUCTED AMOUNT
      ${sym}${amt}
F50A:           /${(inst.accountNumber || "GB32HBUK40086810148040").toUpperCase()}
                ${(inst.accountName   || "XA FINANCIAL LTD").toUpperCase()}
                ${(inst.address       || "AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK").toUpperCase()}
F52A:           /${sc8}
                ${(inst.bankName || "HSBC UK BANK PLC").toUpperCase()}
                ${(inst.address  || "AYLESBURY, MARKET SQUARE, 8 MARKET SQUARE, AYLESBURY, HP 20 1TW, UK").toUpperCase()}
F57A:           /${(rcv.swiftCode || "BNINIDJAXXX").toUpperCase()}
                ${(rcv.bankName   || "BANK NEGARA INDONESIA - PT (PERSERO)").toUpperCase()}
                ${(rcv.address    || "BNI BUILDING, FLOOR 7, JALAN JENDERAL SUDIRMAN 1, JAKARTA, INDONESIA").toUpperCase()}
F59:
     /${(ben.accountNumber || "8460946829").toUpperCase()}
     /${(ben.swiftCode     || "BNINIDJAXXX").toUpperCase()}
     ${(ben.accountName    || "PT ALDO PUTRA MANDIRI BANDUNG").toUpperCase()}
     ${(ben.address        || "BNI BUILDING, JALAN ASIA AFRIKA, BANDUNG, INDONESIA").toUpperCase()}


F70:            /REMITTANCE INFORMATION
                ${(tx.remittanceInfo || "INVESTMENT").toUpperCase()}
F71A:           DETAILS OF CHARGES
                ${chgFmt}
F72:            /SENDER TO RECEIVER INFORMATION
                PLEASE ADVICE THE BENEFICIARY OF THIS SWIFT.
                THIS TRANSFER IS VALID UPON IDENTIFICATION, THE DAY OF RECEIPT.
                THIS IRREVOCABLE CASH SWIFT/103 TRANSFER CAN BE RELIED UPON FOR FULL
                CASH.FUNDS ARE CLEAN AND CLEAR, OF NON-CRIMINAL ORIGIN.
F77B:           /REGULATORY REPORTING
                #${amt}#
${dash("MESSAGE TRAILER")}
{CHK: ${(tech.chk          || "HBUKGB4B2119809863").toUpperCase()}}
PKI SIGNATURE: ${(tech.pkiSignature || "MAC-EQUIVALENT").toUpperCase()}`;

  // ── page 2 text ─────────────────────────────────────────────────────
  const p2 = `${dash("INTERVENTIONS")}
CONFIRMED AND RECEIVED
${"-".repeat(W)}
ANSWER BACK AND ACKNOWLEDGMENT MESSAGE AUTOMATED FILE TRANSFER (AFT)
GATEWAY RESPONSE VALIDATION SERVICE PROVIDER LOG/APPLICATION GENERATED REPORT ACKNOWLEDGMENT
& AUTHENTICATION ACK MSG DELIVERY

FTA/FTI CONFIRMATION STATEMENT PASS/FAIL STATUS

0050 CNT, -------------------------------- Valid
0060 RFF-DTM, ---------------------------- Valid
0070 RFF, -------------------------------- Valid
0080 DTM, -------------------------------- Valid
0090 NAD-CTA-COM-------------------------- Valid
0100 NAD, -------------------------------- Valid
0110 CTA, -------------------------------- Valid
0120 COM, -------------------------------- Valid
0130 ERC-FTX-5G4, ------------------------ Valid
0140 ERC, -------------------------------- Valid
0150 FTX, -------------------------------- Valid
0160 RFF-FTX, ---------------------------- Valid
0170 REF, -------------------------------- Valid
0180 FTX, -------------------------------- Valid
0190 UNT, -------------------------------- Valid

${dash("{XMT DELIVERY REPORT}")}
TRACK CODE: ${track}
CATEGORY: NETWORK REPORT
CREATION DATE/TIME: ${dt.ts}
APPLICATION: SWIFT / 103
OPERATION: SYSTEM
TEXT {1:F01 ${dt.yy}${sc8} ${inst.accountNumber || "GB32HBUK40086810148040"}} {2:P103${rcv.swiftCode || "BNINIDJAXXX"} ${ben.accountNumber || "8980888829"}}
{2:{254:124}{141:}
${"-".repeat(W)}
(+) END OF MESSAGE
${"*".repeat(W)}
MESSAGE HAS BEEN TRANSMITTED SUCCESSFULLY (02) ${"*".repeat(W - 46)}
CIPHER: ${cipher}
END OF TRANSMISSION
${xmit}`;

  // ── shared inline styles ────────────────────────────────────────────
  const preStyle = {
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: "normal",
    fontSize: "10.5px",
    lineHeight: "13.5px",
    whiteSpace: "pre",
    color: "black",
    margin: 0,
    padding: 0,
  };

  const footerStyle = {
    position: "absolute",
    bottom: "12mm",
    right: "15mm",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "9px",
    color: "#b0b0b0",
    textTransform: "uppercase",
    userSelect: "none",
    pointerEvents: "none",
  };

  // ── render ──────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-200 rounded-2xl p-4 md:p-6 print:bg-white print:p-0">
      {/* Buttons – hidden on print */}
      <div className="flex flex-wrap justify-between gap-3 mb-6 no-print">
        <button onClick={onBack} className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold transition text-sm text-gray-800">
          ← Back to Form
        </button>
        <button onClick={() => window.print()} className="px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-lg font-semibold transition text-sm shadow-md">
          🖨️ Print / Download PDF
        </button>
      </div>

      {/* Pages */}
      <div className="flex flex-col items-center gap-8 my-4 print:my-0 print:gap-0 bg-gray-600 py-8 px-4 rounded-xl print:bg-white print:p-0">

        {/* ─── PAGE 1 ─── */}
        <div className="swift-page print-page relative flex flex-col bg-white" id="hsbc-printout-page1">
          {/* Logo + Barcode header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/hsbc.jpg"
              alt="HSBC"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
            />
            <Barcode value={tx.senderReference || "HSBC587069248914"} />
          </div>

          {/* SWIFT text */}
          <pre style={preStyle}>{p1}</pre>

          {/* Footer */}
          <div style={footerStyle}>HSBC UK WIRE SYSTEM • PAGE 1 OF 2</div>
        </div>

        {/* ─── PAGE 2 ─── */}
        <div className="swift-page print-page relative flex flex-col bg-white" id="hsbc-printout-page2">
          {/* Logo header row (no barcode on page 2) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/hsbc.jpg"
              alt="HSBC"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
            />
          </div>

          {/* SWIFT text */}
          <pre style={preStyle}>{p2}</pre>

          {/* Footer */}
          <div style={footerStyle}>HSBC UK WIRE SYSTEM • PAGE 2 OF 2</div>
        </div>

      </div>
    </div>
  );
};

export default HSBCPrintout;
