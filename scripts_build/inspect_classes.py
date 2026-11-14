with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
# find all class selectors
classes = set(re.findall(r'\.([a-zA-Z0-9_-]+)', css))
print(f"Total unique classes in app.css: {len(classes)}")
important_keywords = ['card', 'panel', 'btn', 'tab', 'hero', 'metric', 'tool', 'journey', 'book', 'sheet', 'task', 'nav', 'header', 'sidebar']
matched = [c for c in classes if any(k in c for k in important_keywords)]
print(f"Matched key components: {len(matched)}")
print(sorted(matched)[:40])
