with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
for i, l in enumerate(lines):
    if 'workflow' in l.lower():
        print(f"L{i}: {l}")
        for j in range(max(0, i-5), min(len(lines), i+20)):
            print(f"  {lines[j]}")
        break
