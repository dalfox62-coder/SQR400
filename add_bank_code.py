import re

with open('app/banks/deutsche/DeutscheForm.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add bankCode to state
state_old = 'swiftCode: initialData.beneficiary?.swiftCode || "BNINIDJAXXX",'
state_new = state_old + '\n      bankCode: initialData.beneficiary?.bankCode || "",'
code = code.replace(state_old, state_new)

# Add Bank Code field to UI before Bank Swift Code
ui_old = '''          <div>
            <label className={labelClass}>Bank Swift Code</label>
            <input
              type="text"'''
ui_new = '''          <div>
            <label className={labelClass}>Bank Code</label>
            <input
              type="text"
              className={inputClass}
              value={formData.beneficiary.bankCode}
              onChange={(e) => handleChange("beneficiary", "bankCode", e.target.value)}
              placeholder="e.g. 37070060"
            />
          </div>
          <div>
            <label className={labelClass}>Bank Swift Code</label>
            <input
              type="text"'''
code = code.replace(ui_old, ui_new)

with open('app/banks/deutsche/DeutscheForm.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

with open('app/banks/deutsche/DeutschePrintout.tsx', 'r', encoding='utf-8') as f:
    printout = f.read()

# Modify account number display in printout to include bankCode
po_old = '${(beneficiary.accountNumber || "0811-01-021431-50-8").toUpperCase()}'
po_new = '${(beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber || "0811-01-021431-50-8").toUpperCase()}'
printout = printout.replace(po_old, po_new)

with open('app/banks/deutsche/DeutschePrintout.tsx', 'w', encoding='utf-8') as f:
    f.write(printout)

print('Modified form and printout')
