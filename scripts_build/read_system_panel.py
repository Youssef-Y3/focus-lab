with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('class="panel system-panel"')
print(text[pos-100:pos+1200])
