import bs4

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = bs4.BeautifulSoup(html, 'html.parser')

hero_actions = soup.find('div', class_='hero-actions')
if hero_actions and not hero_actions.find('button', attrs={'data-go': 'student'}):
    student_btn = soup.new_tag('button', attrs={
        'class': 'btn btn-primary',
        'data-go': 'student',
        'style': 'background:linear-gradient(135deg,#f59e0b,#d97706); border:0; box-shadow:0 0 20px rgba(245,158,11,0.4); font-weight:800;'
    })
    student_btn.append(bs4.BeautifulSoup('🎓 ادخل بوابة شباب الجامعة <span>★</span>', 'html.parser'))
    hero_actions.insert(0, student_btn)
    print("Added student button to hero-actions")

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
