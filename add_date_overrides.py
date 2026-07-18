import re

# 1. Update DeutscheForm.tsx
with open('app/banks/deutsche/DeutscheForm.tsx', 'r', encoding='utf-8') as f:
    f1_code = f.read()

# Add to state
f1_code = f1_code.replace(
    'valueDate: initialData.transaction?.valueDate || "2024-10-25",',
    'valueDate: initialData.transaction?.valueDate || "2024-10-25",\n      topHeaderDate: initialData.transaction?.topHeaderDate || "",\n      settlementDate: initialData.transaction?.settlementDate || "",'
)

# Add inputs
f1_inputs = """          <div>
            <label className={labelClass}>Top Header Date Override (V2)</label>
            <input type="text" className={inputClass} placeholder="e.g. MONDAY, JUNE 30, 2025" value={formData.transaction.topHeaderDate || ""} onChange={(e) => handleChange("transaction", "topHeaderDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Settlement Date Override (V2)</label>
            <input type="text" className={inputClass} placeholder="e.g. 30.06.2025" value={formData.transaction.settlementDate || ""} onChange={(e) => handleChange("transaction", "settlementDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Value Date</label>"""
            
f1_code = f1_code.replace(
    '<div>\n            <label className={labelClass}>Value Date</label>',
    f1_inputs
)

with open('app/banks/deutsche/DeutscheForm.tsx', 'w', encoding='utf-8') as f:
    f.write(f1_code)

# 2. Update DeutscheFormV2.tsx
with open('app/banks/deutsche/DeutscheFormV2.tsx', 'r', encoding='utf-8') as f:
    f2_code = f.read()

f2_code = f2_code.replace(
    'valueDate: initialData.transaction?.valueDate || "2025-06-30",',
    'valueDate: initialData.transaction?.valueDate || "2025-06-30",\n      topHeaderDate: initialData.transaction?.topHeaderDate || "",\n      settlementDate: initialData.transaction?.settlementDate || "",'
)

f2_code = f2_code.replace(
    '<div>\n            <label className={labelClass}>Value Date</label>',
    f1_inputs
)

with open('app/banks/deutsche/DeutscheFormV2.tsx', 'w', encoding='utf-8') as f:
    f.write(f2_code)


# 3. Update DeutschePrintoutV2.tsx
with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'r', encoding='utf-8') as f:
    p2_code = f.read()

p2_old_dates = """   const postDateFormatted = transaction.valueDate ? new Date(transaction.valueDate).toLocaleDateString("en-GB").replace(/\\//g, ".") : "30.06.2025";
   const postTime = transaction.postTime || "11:49:54";

   
   const topHeaderDate = transaction.valueDate 
      ? new Date(transaction.valueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() 
      : "MONDAY, JUNE 30, 2025";"""

p2_new_dates = """   let postDateFormatted = transaction.valueDate ? new Date(transaction.valueDate).toLocaleDateString("en-GB").replace(/\\//g, ".") : "30.06.2025";
   if (transaction.settlementDate) {
      postDateFormatted = transaction.settlementDate;
   }
   const postTime = transaction.postTime || "11:49:54";

   
   let topHeaderDate = transaction.valueDate 
      ? new Date(transaction.valueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() 
      : "MONDAY, JUNE 30, 2025";
   if (transaction.topHeaderDate) {
      topHeaderDate = transaction.topHeaderDate.toUpperCase();
   }"""

p2_code = p2_code.replace(p2_old_dates, p2_new_dates)

with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'w', encoding='utf-8') as f:
    f.write(p2_code)

print("Done")
