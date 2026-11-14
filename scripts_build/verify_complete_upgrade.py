import os

def check():
    with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
        idx = f.read()
    with open('منصة_التركيز_والماستري_للشباب.html', 'r', encoding='utf-8') as f:
        standalone = f.read()
    with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css', 'r', encoding='utf-8') as f:
        css = f.read()
    with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js', 'r', encoding='utf-8') as f:
        js = f.read()

    checks = [
        ("Alexandria font in CSS", "Alexandria" in css),
        ("Source Serif 4 font in CSS", "Source+Serif+4" in css or "Source Serif 4" in css),
        ("Spotlight cursor rules in CSS", "spotlight-card" in css and "--mouse-x" in css),
        ("Interactive workflow rules in CSS", "interactive-workflow-hub" in css),
        ("Editorial manifesto card in CSS", "editorial-manifesto-card" in css),
        ("Sol Floating Dock in CSS", "sol-floating-dock" in css),
        ("Soundwave equalizer animation in CSS", "dock-soundwave" in css),
        
        ("Manifesto card in index.html", "editorial-manifesto-card" in idx),
        ("Interactive workflow hub in index.html", "interactiveWorkflowHub" in idx),
        ("Sol floating dock in index.html", "solFloatingDock" in idx),
        
        ("Workflow data in JS", "WORKFLOW_DATA" in js),
        ("Workflow hub initializer in JS", "initWorkflowHub" in js),
        ("Sol dock initializer in JS", "initSolFloatingDock" in js),
        ("Spotlight tracker in JS", "initSpotlightTracker" in js),
        
        ("Standalone has workflow hub", "interactiveWorkflowHub" in standalone),
        ("Standalone has manifesto card", "editorial-manifesto-card" in standalone),
        ("Standalone has floating dock", "solFloatingDock" in standalone),
        ("Standalone has font import", "Source+Serif+4" in standalone or "Source Serif 4" in standalone),
    ]

    all_passed = True
    print("=" * 60)
    print("      FOCUS LAB × TAFRA OS - UPGRADE VERIFICATION")
    print("=" * 60)
    for name, passed in checks:
        status = "PASSED [✓]" if passed else "FAILED [X]"
        print(f"{name:<42} : {status}")
        if not passed:
            all_passed = False

    print("=" * 60)
    if all_passed:
        print("ALL 17 UPGRADE CHECKS PASSED WITH 100% SUCCESS!")
    else:
        print("SOME CHECKS FAILED!")
    print("=" * 60)

if __name__ == '__main__':
    check()
