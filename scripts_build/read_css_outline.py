with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
print(f"Total lines: {len(lines)}")
# Print major section headings
for i, l in enumerate(lines):
    if l.strip().startswith('/* =====') or l.strip().startswith('/* -----'):
        print(f"L{i}: {lines[min(i+1, len(lines)-1)].strip()}")
