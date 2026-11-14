with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css', 'r', encoding='utf-8') as f:
    css = f.read()

print("modern.css length:", len(css))
lines = css.split('\n')
print("Total lines:", len(lines))
# print top 50 lines and summary of section comments
for i, line in enumerate(lines):
    if line.startswith('/* ===') or line.startswith('/* ---') or (line.startswith('/*') and '===' in line):
        print(f"L{i}: {line[:80]}")
