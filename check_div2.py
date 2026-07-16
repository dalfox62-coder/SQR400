import re
with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

start = code.find('return (')
content = code[start:]
content = re.sub(r'<div[^>]*/>', '', content)
content = re.sub(r'\{/\*.*?\*/\}', '', content, flags=re.DOTALL)

def check_div_balance(html_string):
    open_tags = len(re.findall(r'<div[^>]*>', html_string))
    close_tags = len(re.findall(r'</div>', html_string))
    return open_tags - close_tags

print(f"Total balance: {check_div_balance(content)}")

# Let's find exactly where it goes negative
balance = 0
for i, line in enumerate(content.split('\n')):
    opens = len(re.findall(r'<div[^>]*>', line))
    closes = len(re.findall(r'</div>', line))
    balance += opens - closes
    if balance < 0:
        print(f"Balance went negative at relative line {i+1}: {line.strip()}")
        balance = 0 # reset to find more
