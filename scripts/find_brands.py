import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_file = 'Facebook.html'
with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

brands = [
    'Marshmallow',
    'Cozy',
    'PaiMart',
    'Dentflix',
    'BASECAMP',
    'Basecamp',
    'Alvin',
    'Cake Town',
    'HER Studio'
]

output = []
for b in brands:
    matches = [m.start() for m in re.finditer(re.escape(b), html, re.IGNORECASE)]
    output.append(f"=== Brand '{b}': {len(matches)} occurrences ===")
    
    for idx in matches[:4]:
        start = max(0, idx - 800)
        end = min(len(html), idx + 2500)
        chunk = html[start:end]
        
        clean = re.sub(r'<[^>]+>', ' ', chunk)
        clean = ' '.join(clean.split())
        
        reels = list(set(re.findall(r'/(?:reel|videos)/(\d+)', chunk)))
        imgs = list(set(re.findall(r'src="([^"]+?\.(?:jpg|png|webp))"', chunk)))
        
        output.append(f"Match at {idx}:")
        output.append(f"  Reels: {reels}")
        output.append(f"  Imgs: {imgs[:5]}")
        output.append(f"  Text snippet: {clean[:400]}")
        output.append("-" * 40)

with open('scripts/brand_matches.txt', 'w', encoding='utf-8') as out:
    out.write('\n'.join(output))

print("Wrote scripts/brand_matches.txt successfully.")
