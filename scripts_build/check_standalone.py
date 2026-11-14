import re

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/FOCUS_LAB_TAFRA_OS_Standalone.html', 'r', encoding='utf-8') as f:
    text = f.read(2000)
    print("Standalone start:")
    print(text[:800])

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/FOCUS_LAB_TAFRA_OS_Standalone.html', 'r', encoding='utf-8') as f:
    f.seek(0, 2)
    size = f.tell()
    f.seek(max(0, size - 2000))
    tail = f.read()
    print("Standalone end:")
    print(tail[-800:])
