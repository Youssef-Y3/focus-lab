with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function updateOverview')
if pos != -1:
    print(text[pos:pos+1000])
