import re
import json

with open("prototype_raw.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find NAV_ITEMS
nav_items = []
nav_match = re.search(r"const NAV_ITEMS = \[(.*?)\];", html, re.DOTALL)
if nav_match:
    items_raw = nav_match.group(1)
    for m in re.finditer(r"id:\s*'([^']*)',\s*label:\s*'([^']*)',\s*icon:\s*'([^']*)'", items_raw):
        nav_items.append({"id": m.group(1), "label": m.group(2), "icon": m.group(3)})

# Find all render functions
renders = re.findall(r"function\s+(render\w+)\s*\(", html)

# Find all other functions
all_funcs = re.findall(r"function\s+(\w+)\s*\(", html)

# Let's inspect the switch/case or dispatch in renderPage
render_page_match = re.search(r"function renderPage\(pageId\)\s*\{(.*?)\n\}", html, re.DOTALL)

with open("prototype_structure.json", "w", encoding="utf-8") as f:
    json.dump({
        "nav_items": nav_items,
        "render_functions": renders,
        "all_functions": all_funcs,
        "renderPage_snippet": render_page_match.group(0)[:1500] if render_page_match else "None"
    }, f, indent=2)

print("Done extracting structure")
