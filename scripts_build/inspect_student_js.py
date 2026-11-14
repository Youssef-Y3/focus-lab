with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js', 'r', encoding='utf-8') as f:
    code = f.read()

print("student-hub.js length:", len(code))
lines = code.split('\n')
print("Total lines:", len(lines))
# Check what functions and listeners are registered
for i, l in enumerate(lines):
    if 'function ' in l or 'addEventListener' in l or 'class ' in l:
        print(f"L{i}: {l[:70]}")
