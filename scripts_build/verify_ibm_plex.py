with open('منصة_التركيز_والماستري_للشباب.html', 'r', encoding='utf-8') as f:
    text = f.read()

font_check = "IBM+Plex+Sans+Arabic" in text
font_rule = "IBM Plex Sans Arabic" in text
print("Google font link present:", font_check)
print("Font-family rule present:", font_rule)
