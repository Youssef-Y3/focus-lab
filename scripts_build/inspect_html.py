import re, os, bs4

html_path = 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

soup = bs4.BeautifulSoup(html, 'html.parser')
print("Pages in index.html:")
for s in soup.find_all('section', class_='page'):
    print(s.get('id'))

nav = soup.find('nav', class_='primary-nav')
print("Nav buttons:")
for btn in nav.find_all('button'):
    print(btn.get('data-page'), btn.get_text(strip=True))
