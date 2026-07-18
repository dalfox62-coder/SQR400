import re

# 1. Update DeutschePrintoutV2.tsx
with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'r', encoding='utf-8') as f:
    v2_code = f.read()

# Add date computations before generateMT103Text
date_computations = """
   const topHeaderDate = transaction.valueDate 
      ? new Date(transaction.valueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() 
      : "MONDAY, JUNE 30, 2025";
   
   const acksDateStr = transaction.valueDate
      ? (() => {
           const d = new Date(transaction.valueDate);
           const day = String(d.getDate()).padStart(2, '0');
           const month = String(d.getMonth() + 1).padStart(2, '0');
           const year = d.getFullYear();
           return `${day}${month}-${year}`;
        })()
      : "3006-2025";

   const generateMT103Text = (isPage2 = false) => {"""

v2_code = v2_code.replace("const generateMT103Text = (isPage2 = false) => {", date_computations)

# Update hardcoded header dates in generateMT103Text string
v2_code = v2_code.replace(
    "MONDAY, JUNE 30, 2025 11:49:54",
    "${topHeaderDate} ${postTime}"
)
v2_code = v2_code.replace(
    "ACKS-3006-2025-1",
    "ACKS-${acksDateStr}-1"
)

# Update hardcoded date span
v2_code = v2_code.replace(
    "<span>Date 30.06.2025</span>",
    "<span>Date {postDateFormatted}</span>"
)

# Update instructed amount to match amount (fixes image 2)
v2_code = v2_code.replace(
    "${formatNumber(transaction.instructedAmount)}",
    "${formatNumber(transaction.amount)}"
)

with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'w', encoding='utf-8') as f:
    f.write(v2_code)

print("Updated DeutschePrintoutV2.tsx")

# 2. Update DeutscheFormV2.tsx to change default Remittance Info
with open('app/banks/deutsche/DeutscheFormV2.tsx', 'r', encoding='utf-8') as f:
    form_v2_code = f.read()

form_v2_code = form_v2_code.replace(
    '"INVESTMENT PAYMENT UNDER AGREEMENT NO. DCL-PRC-0625\\nAGREEMENT DATE: JUNE 06, 2025"',
    '"INVOICE SETTLEMENT"'
)

with open('app/banks/deutsche/DeutscheFormV2.tsx', 'w', encoding='utf-8') as f:
    f.write(form_v2_code)

print("Updated DeutscheFormV2.tsx")
