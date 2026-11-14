with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '===' in line or '---' in line:
        snippet = "".join(lines[i:min(i+3, len(lines))]).strip()
        print(f"L{i}: {snippet}\n")
