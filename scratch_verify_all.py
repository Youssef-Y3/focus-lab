"""
Comprehensive Quality Verification Suite for FOCUS LAB × TAFRA OS
"""
import os
import re
import subprocess
import sys

def run_tests():
    print("=" * 60)
    print("RUNNING COMPREHENSIVE TAFRA OS VERIFICATION SUITE")
    print("=" * 60)

    passes = 0
    fails = 0

    def check(name, condition, info=""):
        nonlocal passes, fails
        if condition:
            print(f"[PASS] {name}")
            passes += 1
        else:
            print(f"[FAIL] {name} - {info}")
            fails += 1

    # 1. Syntax check on JS files
    res = subprocess.run(["node", "-c", "FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js"], capture_output=True, text=True)
    check("app.js syntax valid", res.returncode == 0, res.stderr)

    res = subprocess.run(["node", "-c", "FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js"], capture_output=True, text=True)
    check("student-hub.js syntax valid", res.returncode == 0, res.stderr)

    # 2. Check files exist
    standalone_path = "FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/FOCUS_LAB_TAFRA_OS_Standalone.html"
    root_standalone = "منصة_التركيز_والماستري_للشباب.html"
    check("Standalone HTML exists", os.path.exists(standalone_path))
    check("Root Arabic standalone exists", os.path.exists(root_standalone))

    # 3. Read standalone content
    with open(standalone_path, "r", encoding="utf-8") as f:
        html = f.read()

    # 4. Check founder image inlined as base64
    check("Founder image inlined in standalone", "data:image/jpeg;base64," in html and 'class="founder-photo"' in html)
    check("Sidebar founder thumb present", 'class="founder-sidebar-thumb"' in html)
    check("Founder glass tag present", 'class="founder-glass-tag"' in html and "ARCHITECT & FOUNDER" in html)

    # 5. Check Pages existence
    pages = [
        "page-overview", "page-student", "page-learn", "page-tools",
        "page-journey", "page-mastery", "page-tafra", "page-betafra",
        "page-research", "page-archive"
    ]
    for p in pages:
        check(f"Page container {p} present", f'id="{p}"' in html)

    # 6. Check that old Three.js and radial nav files are NOT referenced
    check("No three.min.js reference", "three.min.js" not in html)
    check("No radial_nav.js reference", "radial_nav.js" not in html)
    check("No three_bento.js reference", "three_bento.js" not in html)
    check("No hero_shader.js reference", "hero_shader.js" not in html)

    # 7. Check student hub components
    student_checks = [
        "studentTabContent", "study-war-room", "sos-wizard-box",
        "activeRecallCard", "teleprompter-overlay", "zen-overlay",
        "bento-showcase-grid", "hero-orbit-stage", "mindly-hero-stage"
    ]
    for sc in student_checks:
        check(f"Student Hub component {sc} present", sc in html)

    # 8. Check CSS styling of overlays (no leakage)
    with open("FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css", "r", encoding="utf-8") as f:
        css = f.read()
    check("teleprompter-overlay hidden by default", ".teleprompter-overlay" in css and "display: none !important" in css)
    check("zen-overlay hidden by default", ".zen-overlay" in css and "display: none !important" in css)

    # 9. Check null-safe bindEvents in app.js
    with open("FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()
    check("app.js curSec guard present", "const curSec = $(\"#currentSection\")" in app_js)
    check("app.js toolSearch guard present", "const ts=$(\"#toolSearch\")" in app_js)
    check("app.js student openPage hook present", 'name==="student" && window.renderStudentHub' in app_js)

    # 10. Check student-hub.js renders on DOMContentLoaded
    with open("FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js", "r", encoding="utf-8") as f:
        sh_js = f.read()
    check("student-hub.js calls renderStudentHub on load", "renderStudentHub();" in sh_js and "initSpotlightTracker();" in sh_js)

    print("=" * 60)
    print(f"RESULTS: {passes} PASSED, {fails} FAILED")
    print("=" * 60)
    return fails == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
