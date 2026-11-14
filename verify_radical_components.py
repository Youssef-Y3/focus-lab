with open('منصة_التركيز_والماستري_للشباب.html', 'r', encoding='utf-8') as f:
    text = f.read()

checks = [
    ("Studio Topbar", 'class="studio-topbar"' in text),
    ("Studio Hero Section", 'class="studio-hero-section' in text),
    ("Bento Showcase Grid", 'class="bento-showcase-grid"' in text),
    ("40Hz Bento Audio Bars", 'id="bentoAudioBars"' in text),
    ("Active Recall 3D Hologram", 'id="bentoMiniCard"' in text),
    ("Hero Workflow Scroll Button", 'id="heroScrollWorkflowBtn"' in text),
]

for name, res in checks:
    print(f"{name:<30}: {'PASS [✓]' if res else 'FAIL [X]'}")
