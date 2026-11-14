with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's inspect the top part of body down to page-overview
pos_body = html.find('<body>')
pos_overview = html.find('<section class="page active" id="page-overview">')
print(html[pos_body:pos_overview])
