import bs4

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = bs4.BeautifulSoup(html, 'html.parser')

# Check script tags
scripts = [s.get('src') for s in soup.find_all('script') if s.get('src')]
print("Current scripts:", scripts)

if 'assets/student-hub.js' not in scripts:
    new_script = soup.new_tag('script', src='assets/student-hub.js')
    soup.body.append(new_script)
    print("Added student-hub.js script tag")
    with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'w', encoding='utf-8') as f:
        f.write(str(soup))
else:
    print("student-hub.js already present")
