with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
colors = set(re.findall(r'#[0-9a-fA-F]{3,8}', css))
print("Colors in app.css:", len(colors))
print(sorted(list(colors))[:30])
