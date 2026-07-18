import re

with open('app/banks/deutsche/DeutschePrintout.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

fallback = '${(institution.address || "TAUNUSANLAFE 12, 60325 FRANKFURT AM MAIN 60254").toUpperCase()}'

# Replace line 211
code = code.replace(
    '}, \nHEREBY',
    '}, ' + fallback + '\nHEREBY'
)

# Replace line 217
code = code.replace(
    '}, .\nAUTOMATED',
    '}, ' + fallback + '.\nAUTOMATED'
)

# Replace line 223
code = code.replace(
    'BANK AG\n.`',
    'BANK AG\n' + fallback + '.`'
)

with open('app/banks/deutsche/DeutschePrintout.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Replaced')
