import os
import re
import json

html_file = '(1) Dear Ekra Reels _ Facebook.html'
with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Match anchor tags containing reel
reel_blocks = re.findall(r'<a[^>]+href="[^"]*(?:/reel/|/videos/)[^"]*"[^>]*>.*?</a>', html, re.DOTALL)

data = []
seen = set()

for block in reel_blocks:
    href_m = re.search(r'href="([^"]+)"', block)
    href = href_m.group(1) if href_m else ""
    
    img_m = re.search(r'src="([^"]+)"', block)
    img = img_m.group(1) if img_m else ""
    
    # clean inner text
    text = re.sub(r'<[^>]+>', ' ', block).strip()
    text = ' '.join(text.split())
    
    id_m = re.search(r'/(?:reel|videos)/(\d+)', href)
    reel_id = id_m.group(1) if id_m else href
    
    if reel_id and reel_id not in seen and not reel_id.startswith('http'):
        seen.add(reel_id)
        # Check if the image file actually exists locally on disk
        local_img = img.replace('./', '')
        exists = os.path.exists(local_img)
        size = os.path.getsize(local_img) if exists else 0
        data.append({
            'reel_id': reel_id,
            'views_or_text': text,
            'img_path': local_img,
            'img_exists': exists,
            'img_size': size
        })

with open('scripts/all_reels_parsed.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Saved {len(data)} unique reels to scripts/all_reels_parsed.json")

