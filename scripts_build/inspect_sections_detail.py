with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pages = re.findall(r'<section class="page[^"]*" id="page-([^"]+)">', text)
print("Sections found:", pages)

# print sizes of each section
sections = text.split('<section class="page')
for i, s in enumerate(sections[1:], 1):
    pid = s.split('"')[1].replace('id=', '').strip()
    print(f"Section {i}: length {len(s)} chars, starts with: {s[:120].strip()}")
