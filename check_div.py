import re
with open('app/banks/deutsche/DeutschePrintoutV2.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

def check_div_balance(html_string):
    open_tags = len(re.findall(r'<div[^>]*>', html_string))
    close_tags = len(re.findall(r'</div>', html_string))
    return open_tags - close_tags

start = code.find('return (')
content = code[start:]
content = re.sub(r'<div[^>]*/>', '', content)
content = re.sub(r'\{/\*.*?\*/\}', '', content, flags=re.DOTALL)
pages = content.split('className="print-page-wrapper')
for i, p in enumerate(pages):
    print(f'Part {i}: {check_div_balance(p)}')
