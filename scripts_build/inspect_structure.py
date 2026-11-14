import re

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pages = re.findall(r'id=["\']page-([a-zA-Z0-9_-]+)["\']', text)
print('Pages found:', pages)

navs = re.findall(r'data-page=["\']([a-zA-Z0-9_-]+)["\']', text)
print('Nav items found:', set(navs))
