with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

hp_start = text.find('<div class="hero-panel">')
next_sec = text.find('class="section-heading compact-heading"')
print(text[hp_start:next_sec])
