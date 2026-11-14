"""
FOCUS LAB × TAFRA OS — Standalone Bundler (2026 Master Edition)
Inlines all HTML, CSS, SVG sprites, and JavaScript into a single 100% self-contained offline application.
"""
import os
import base64

base_dir = 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT'
index_path = os.path.join(base_dir, 'index.html')
app_css_path = os.path.join(base_dir, 'assets', 'app.css')
modern_css_path = os.path.join(base_dir, 'assets', 'modern.css')
data_js_path = os.path.join(base_dir, 'assets', 'data.js')
corpus_js_path = os.path.join(base_dir, 'assets', 'corpus.js')
app_js_path = os.path.join(base_dir, 'assets', 'app.js')
student_js_path = os.path.join(base_dir, 'assets', 'student-hub.js')
favicon_path = os.path.join(base_dir, 'assets', 'favicon.svg')

with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(app_css_path, 'r', encoding='utf-8') as f:
    app_css = f.read()

with open(modern_css_path, 'r', encoding='utf-8') as f:
    modern_css = f.read()

combined_css = f"<style>\n{app_css}\n{modern_css}\n</style>"

# Replace css links
for link in [
    '<link href="assets/app.css" rel="stylesheet"/>',
    '<link rel="stylesheet" href="assets/app.css">',
    '<link href="assets/modern.css" rel="stylesheet"/>',
    '<link rel="stylesheet" href="assets/modern.css">'
]:
    html = html.replace(link, '')

# In-line favicon if present
if os.path.exists(favicon_path):
    with open(favicon_path, 'rb') as f:
        fav_b64 = base64.b64encode(f.read()).decode('utf-8')
    fav_data_uri = f'data:image/svg+xml;base64,{fav_b64}'
    html = html.replace('href="assets/favicon.svg"', f'href="{fav_data_uri}"')

# In-line founder photo if present
founder_path = os.path.join(base_dir, 'assets', 'founder.jpg')
if os.path.exists(founder_path):
    with open(founder_path, 'rb') as f:
        founder_b64 = base64.b64encode(f.read()).decode('utf-8')
    founder_data_uri = f'data:image/jpeg;base64,{founder_b64}'
    html = html.replace('src="assets/founder.jpg"', f'src="{founder_data_uri}"')

# Insert combined CSS before </head>
html = html.replace('</head>', f'{combined_css}\n</head>')

# Read scripts
with open(data_js_path, 'r', encoding='utf-8') as f:
    data_js = f.read()

with open(corpus_js_path, 'r', encoding='utf-8') as f:
    corpus_js = f.read()

with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

with open(student_js_path, 'r', encoding='utf-8') as f:
    student_js = f.read()

inlined_scripts = f"""
<script>
{data_js}
</script>
<script>
{corpus_js}
</script>
<script>
{app_js}
</script>
<script>
{student_js}
</script>
"""

# Remove external script tags
for s in [
    '<script src="assets/data.js"></script>',
    '<script src="assets/corpus.js"></script>',
    '<script src="assets/app.js"></script>',
    '<script src="assets/three.min.js"></script>',
    '<script src="assets/hero_shader.js"></script>',
    '<script src="assets/radial_nav.js"></script>',
    '<script src="assets/three_bento.js"></script>',
    '<script src="assets/student-hub.js"></script>'
]:
    html = html.replace(s, '')

html = html.replace('</body>', f'{inlined_scripts}\n</body>')

# Save to FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/FOCUS_LAB_TAFRA_OS_Standalone.html
out_path_1 = os.path.join(base_dir, 'FOCUS_LAB_TAFRA_OS_Standalone.html')
with open(out_path_1, 'w', encoding='utf-8') as f:
    f.write(html)
print(f"Generated {out_path_1} ({os.path.getsize(out_path_1)} bytes)")

# Save to root workspace as well
out_path_2 = 'منصة_التركيز_والماستري_للشباب.html'
with open(out_path_2, 'w', encoding='utf-8') as f:
    f.write(html)
print(f"Generated root standalone: {out_path_2} ({os.path.getsize(out_path_2)} bytes)")
print("Standalone build successful!")
