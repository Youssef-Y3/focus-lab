with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = '</div><div class="detail-actions">'
replacement = '''</div>
<div style="margin-top:14px; text-align:center;">
  <button type="button" class="btn btn-primary" onclick="window.openTeleprompter && window.openTeleprompter('${esc(x["اسم الفكرة"])}', '${esc((x["الهوك (أول 3 ثواني)"] || "") + "\\n\\n" + (x["بنية السكريبت"] || "") + "\\n\\n" + (x["الـ CTA"] || ""))}')" style="background:linear-gradient(135deg,#0284c7,#06b6d4); border:0; padding:10px 22px; font-weight:800;">
    🎙️ تشغيل ملقن الكاميرا (Teleprompter Mode)
  </button>
</div>
<div class="detail-actions">'''

if target in code and 'openTeleprompter' not in code:
    code = code.replace(target, replacement, 1)
    with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Teleprompter button added to showBankDetail in app.js!")
else:
    print("Already present or target not found")
