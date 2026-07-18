import re

with open('app/utils/bankConfig.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace address for deutsche
code = code.replace(
    'address: "TAUNUSANLAFE 12, 60325 FRANKFURT AM MAIN 60254",',
    'address: "DEUTSCHE BANK A.G. TAUNUSANLAFE 12, FERANKURT AM MAIN 60254 FERNKFURT GERMANY",'
)
code = code.replace(
    'receiverAddress: "TAUNUSANLAFE 12, 60325 FRANKFURT AM MAIN 60254",',
    'receiverAddress: "DEUTSCHE BANK A.G. TAUNUSANLAFE 12, FERANKURT AM MAIN 60254 FERNKFURT GERMANY",'
)

# Replace address for deutsche_v2
code = code.replace(
    'address: "TAUNUSANLAGE 12, 60325 FRANKFURT AM MAIN GERMANY",',
    'address: "DEUTSCHE BANK A.G. TAUNUSANLAFE 12, FERANKURT AM MAIN 60254 FERNKFURT GERMANY",'
)

with open('app/utils/bankConfig.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print('Replaced in bankConfig.ts')
