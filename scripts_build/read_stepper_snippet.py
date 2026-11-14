with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('workflow-stepper')
print(text[pos-100:pos+800])
