with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

print("Contains page-student?", "page-student" in text)
print("Contains page-overview?", "page-overview" in text)
print("Contains data-page=\"student\"?", 'data-page="student"' in text)
