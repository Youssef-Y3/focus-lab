with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js', 'r', encoding='utf-8') as f:
    text = f.read()

lines = [l for l in text.split('\n') if 'audio' in l.lower() and ('window.' in l or 'const ' in l or 'let ' in l)]
for l in lines[:10]:
    print(l)
