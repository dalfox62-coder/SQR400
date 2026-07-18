import re

with open('app/banks/deutsche/DeutschePrintout.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Apply user's unsaved changes:
code = code.replace('DEUTDEFFXXX', 'DEUTDEFF9925')
code = code.replace('TAUNUSANLAGE', 'TAUNUSANLAFE')

# Apply the bankCode logic to V1 account number (as seen in their IDE diff)
old_acc_num = '***ACCOUNT NUMBER   : ${(beneficiary.accountNumber || "0811-01-021431-50-8").toUpperCase()}'
new_acc_num = '***ACCOUNT NUMBER   : ${(beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber || "0811-01-021431-50-8").toUpperCase()}'
code = code.replace(old_acc_num, new_acc_num)

old_acc_num2 = 'ACCOUNT NUMBER                 : ${(beneficiary.accountNumber || "0811-01-021431-50-8").toUpperCase()}'
new_acc_num2 = 'ACCOUNT NUMBER                 : ${(beneficiary.bankCode ? beneficiary.bankCode + beneficiary.accountNumber : beneficiary.accountNumber || "0811-01-021431-50-8").toUpperCase()}'
code = code.replace(old_acc_num2, new_acc_num2)

# Apply the requested MESSAGE REFERENCE change
code = code.replace(
    "MESSAGE REFERENCE: 1856734949-1247881431",
    "MESSAGE REFERENCE: 20230413DEUTDEFF992520230413"
)

with open('app/banks/deutsche/DeutschePrintout.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied user changes and updated MESSAGE REFERENCE")
