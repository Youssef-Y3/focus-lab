with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

print("app.js length:", len(code))
lines = code.split('\n')
print("Total lines:", len(lines))
# Check what functions and listeners are registered
for i, l in enumerate(lines):
    if 'function ' in l or 'addEventListener' in l or 'navigateTo' in l or 'render' in l:
        if any(keyword in l for keyword in ['navigateTo', 'render', 'switch', 'init']):
            print(f"L{i}: {l[:80]}")
