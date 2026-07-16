with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace Round Stamp Background right offset
old_round = 'className="absolute top-[30px] right-[40px] w-32 h-32 flex items-center justify-center opacity-85 z-10 pointer-events-none print-bg"'
new_round = 'className="absolute top-[30px] right-[10px] w-32 h-32 flex items-center justify-center opacity-85 z-10 pointer-events-none print-bg"'
code = code.replace(old_round, new_round)

# Replace Stamp Overlay right offset
old_overlay = 'className="absolute top-[30px] -right-[15px] w-[340px] h-[140px] border-[3px] border-[#0018a8] text-[#0018a8] -rotate-[16deg] flex flex-col justify-center items-center opacity-85 p-2 print-bg z-20"'
new_overlay = 'className="absolute top-[30px] -right-[45px] w-[340px] h-[140px] border-[3px] border-[#0018a8] text-[#0018a8] -rotate-[16deg] flex flex-col justify-center items-center opacity-85 p-2 print-bg z-20"'
code = code.replace(old_overlay, new_overlay)

# Replace Signature text size and right offset
old_sig = 'className="absolute -top-[15px] -right-[20px] text-[#0018a8] text-[40px] opacity-90 transform -rotate-[20deg] z-30 tracking-tighter whitespace-nowrap"'
new_sig = 'className="absolute -top-[15px] -right-[50px] text-[#0018a8] text-[26px] opacity-90 transform -rotate-[20deg] z-30 tracking-tighter whitespace-nowrap"'
code = code.replace(old_sig, new_sig)

with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print('Replaced successfully')
