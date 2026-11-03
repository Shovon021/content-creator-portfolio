import re
import json

file_path = "Facebook.html"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

print(f"File Size: {len(html)} bytes")

# Title & Meta
title = re.search(r'<title>(.*?)</title>', html)
print("Title:", title.group(1) if title else "N/A")

for meta in re.findall(r'<meta[^>]+>', html):
    if any(k in meta for k in ['og:', 'al:', 'description', 'twitter:']):
        print("Meta:", meta[:180])

# Look for Intro / Bio / About text
print("\n--- INTRO / ABOUT / CONTACT SEARCH ---")
intro_patterns = [
    r'("text":"([^"]{20,300})")',
    r'(\b\d[\d,]*\s+(?:followers|likes|following|people follow this|people like this))',
    r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)',
    r'(https?://(?:www\.)?(?:instagram\.com|youtube\.com|wa\.me|tiktok\.com)/[^\s"\'<>]+)',
    r'("category_name":"([^"]+)")',
    r'("address":"([^"]+)")'
]

for p in intro_patterns:
    matches = list(set(re.findall(p, html, re.IGNORECASE)))
    if matches:
        print(f"Pattern {p[:30]}... matches ({len(matches)}):")
        for m in matches[:8]:
            print("  -", m)

# Search for timeline posts / captions
print("\n--- POST TEXT / CAPTIONS ---")
# Look for post message text
post_texts = []
for m in re.finditer(r'"message":{"text":"([^"]+)"', html):
    txt = m.group(1).encode('utf-8').decode('unicode_escape', errors='ignore')
    post_texts.append(txt)

print(f"Found {len(post_texts)} post message texts:")
for i, pt in enumerate(list(dict.fromkeys(post_texts))[:10], 1):
    print(f"{i}. {pt[:120]}...")

