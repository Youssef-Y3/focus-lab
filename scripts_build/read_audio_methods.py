with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
print("\n".join(lines[60:160]))
