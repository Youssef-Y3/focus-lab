# Script to inspect the current topbar and hero in index.html
with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find header topbar
tb_start = text.find('<header class="topbar">')
tb_end = text.find('</header>') + len('</header>')
print("TOPBAR current snippet:")
print(text[tb_start:tb_end])

hp_start = text.find('<div class="hero-panel">')
hp_end = text.find('</div>\n</div>\n<div class="section-heading compact-heading">')
print("\nHERO PANEL current snippet:")
print(text[hp_start:hp_start+400])
