with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect lines 1 to 200 of modern.css
lines = text.split('\n')
print("\n".join(lines[:120]))
