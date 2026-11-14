import os, glob

for path in ['FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js', 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js']:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    if 'workflow-stepper' in text:
        print(f"Found in {path}")
        lines = [l for l in text.split('\n') if 'workflow-stepper' in l]
        for l in lines[:5]:
            print("  ", l[:100])
