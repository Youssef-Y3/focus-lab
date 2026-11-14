with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update openPage to include student
target_open = 'if(name==="overview") updateOverview();'
replacement_open = 'if(name==="overview") updateOverview();\n  if(name==="student" && window.renderStudentHub) window.renderStudentHub();'
if target_open in code and 'name==="student"' not in code:
    code = code.replace(target_open, replacement_open)
    print("Added student hook in openPage")

# 2. Expose window.APP at end of IIFE
target_end = 'console.info("FOCUS LAB × TAFRA OS ready"'
replacement_end = '''window.APP = {
    openPage, toast, getState: () => state, persist, openTool, updateOverview, D, CORPUS
  };
  console.info("FOCUS LAB × TAFRA OS ready"'''
if target_end in code and 'window.APP =' not in code:
    code = code.replace(target_end, replacement_end)
    print("Exposed window.APP")

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("app.js updated successfully!")
