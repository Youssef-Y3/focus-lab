with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('window.APP = {')
print(text[pos:pos+400])
