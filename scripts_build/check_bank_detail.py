with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('function showBankDetail')
if pos != -1:
    print(text[pos:pos+1200])
else:
    print("showBankDetail not found")
