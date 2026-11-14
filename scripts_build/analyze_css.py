with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css', 'r', encoding='utf-8') as f:
    text = f.read()

print("CSS length:", len(text))
# Check what classes exist
for c in ['workflow', 'ticker', 'bento', 'topbar', 'sidebar', 'hero', 'student']:
    print(f"Occurrences of {c}:", text.count(c))
