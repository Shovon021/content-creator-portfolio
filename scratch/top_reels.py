import re

with open("(1) Dear Ekra Reels _ Facebook.html", "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

reel_links = re.findall(r'<a[^>]+href="([^"]*?/reel/\d+[^"]*?)"[^>]*>(.*?)</a>', html, re.DOTALL)

items = []
for href, inner in reel_links:
    m = re.search(r'/reel/(\d+)', href)
    if m:
        rid = m.group(1)
        # extract play count
        txt = re.sub(r'<[^>]+>', ' ', inner).strip()
        img_match = re.search(r'<img[^>]+src="([^"]+)"', inner)
        
        # parse numeric value from txt like "1.2M", "517K", "37K"
        val = 0
        if 'M' in txt:
            try: val = float(txt.replace('M', '').strip()) * 1000000
            except: pass
        elif 'K' in txt:
            try: val = float(txt.replace('K', '').strip()) * 1000
            except: pass
        elif txt.isdigit():
            val = int(txt)
            
        items.append({
            "id": rid,
            "url": f"https://www.facebook.com/reel/{rid}",
            "view_text": txt,
            "views_num": val,
            "img": img_match.group(1) if img_match else None
        })

# Deduplicate
seen = set()
unique_items = []
for it in items:
    if it['id'] not in seen:
        seen.add(it['id'])
        unique_items.append(it)

# Sort by view count descending
top_reels = sorted(unique_items, key=lambda x: x['views_num'], reverse=True)

print(f"Top 15 Most-Viewed Reels of Dear Ekra:")
for i, r in enumerate(top_reels[:15], 1):
    print(f"{i}. {r['view_text']} views | ID: {r['id']} | Link: {r['url']}")
    if r['img']:
        print(f"   Local Thumbnail: {r['img']}")

