import os
import re

html_file = '(1) Dear Ekra Reels _ Facebook.html'
if not os.path.exists(html_file):
    print("File not found:", html_file)
    exit(1)

with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Let's inspect where /reel/ occurs and what surrounds it
reel_blocks = re.findall(r'<a[^>]+href="[^"]*(?:/reel/|/videos/)[^"]*"[^>]*>.*?</a>', html, re.DOTALL)
print(f"Total reel blocks matched: {len(reel_blocks)}")

data = []
for block in reel_blocks:
    href_m = re.search(r'href="([^"]+)"', block)
    href = href_m.group(1) if href_m else ""
    
    img_m = re.search(r'src="([^"]+)"', block)
    img = img_m.group(1) if img_m else ""
    
    text = re.sub(r'<[^>]+>', ' ', block).strip()
    text = ' '.join(text.split())
    
    id_m = re.search(r'/(?:reel|videos)/(\d+)', href)
    reel_id = id_m.group(1) if id_m else href
    
    data.append({
        'id': reel_id,
        'href': href,
        'img': img,
        'text': text
    })

seen = set()
for d in data:
    if d['id'] not in seen:
        seen.add(d['id'])
        print(f"ID: {d['id']}")
        print(f"  Img: {d['img']}")
        print(f"  Text: {d['text']}")
        print("-" * 50)

