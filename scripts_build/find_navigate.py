with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[:60]):
    if 'navigate' in l or 'openPage' in l or 'activePage' in l:
        print(f"L{i}: {l}")
