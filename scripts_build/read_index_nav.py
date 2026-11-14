with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
print("\n".join(lines[:60]))
