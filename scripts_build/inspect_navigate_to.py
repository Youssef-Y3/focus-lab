with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function navigateTo(name)')
print(text[pos:pos+450])
