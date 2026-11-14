with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
inline_styles = re.findall(r'style="([^"]+)"', html)
print(f"Total inline styles: {len(inline_styles)}")
for s in inline_styles[:15]:
    if any(k in s for k in ['color', 'background', '#']):
        print("  ", s)
