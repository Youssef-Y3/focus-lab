with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

for l in text.split('\n'):
    if 'window.APP' in l or 'window.render' in l:
        print(l)
