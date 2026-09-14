import sys

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add import
code = code.replace(
    'import CitiForm from "./banks/citi/CitiForm";',
    'import CitiForm from "./banks/citi/CitiForm";\nimport CISForm from "./banks/cis/CISForm";'
)

# Add to renderForm
code = code.replace(
    '      case "citi":\n        return <CitiForm onSubmit={handleSubmit} />;',
    '      case "citi":\n        return <CitiForm onSubmit={handleSubmit} />;\n      case "cis":\n        return <CISForm onSubmit={handleSubmit} />;'
)

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

with open('app/doc/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add import
code = code.replace(
    'import CitiPrintout from "@/app/banks/citi/CitiPrintout";',
    'import CitiPrintout from "@/app/banks/citi/CitiPrintout";\nimport CISPrintout from "@/app/banks/cis/CISPrintout";'
)

# Add render logic
code = code.replace(
    '  if (config.template === "citi") {\n    return <CitiPrintout data={formData} onBack={() => setIsPreview(false)} isPublic={true} />;\n  }',
    '  if (config.template === "citi") {\n    return <CitiPrintout data={formData} onBack={() => setIsPreview(false)} isPublic={true} />;\n  }\n  if (config.template === "cis") {\n    return <CISPrintout data={formData} onBack={() => setIsPreview(false)} isPublic={true} />;\n  }'
)

with open('app/doc/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updates completed")
