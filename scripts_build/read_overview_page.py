with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find overview section
start = text.find('id="page-overview"')
end = text.find('id="page-student"')
print(text[start:start+2500])
