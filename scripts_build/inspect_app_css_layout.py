with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Let's inspect app-shell and layout rules
lines = [l for l in css.split('\n') if any(k in l for k in ['.app-shell', '.sidebar', '.main-area', '.topbar', '.hero-panel'])]
for l in lines[:20]:
    print(l)
