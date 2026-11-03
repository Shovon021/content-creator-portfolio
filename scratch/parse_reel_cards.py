import re
import json

file_path = "(1) Dear Ekra Reels _ Facebook.html"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

# Let's search for reel links and their aria-labels or inner text
# e.g., <a href=".../reel/..." aria-label="..."
reel_links = re.findall(r'<a[^>]+href="([^"]*?/reel/\d+[^"]*?)"[^>]*>(.*?)</a>', html, re.DOTALL)
print(f"Total reel anchor tags: {len(reel_links)}")

unique_reels = {}
for href, inner in reel_links:
    m = re.search(r'/reel/(\d+)', href)
    if m:
        reel_id = m.group(1)
        # find aria-label or img alt or text
        aria = re.search(r'aria-label="([^"]+)"', inner)
        img_src = re.search(r'<img[^>]+src="([^"]+)"', inner)
        clean_text = re.sub(r'<[^>]+>', ' ', inner).strip()
        if reel_id not in unique_reels:
            unique_reels[reel_id] = {
                "href": href,
                "aria": aria.group(1) if aria else None,
                "img": img_src.group(1) if img_src else None,
                "text": clean_text
            }

print(f"Distinct reel cards extracted: {len(unique_reels)}")
print("\nSample Reels extracted from the page:")
for rid, data in list(unique_reels.items())[:12]:
    print(f"\nID: {rid}")
    print(f"  URL: https://www.facebook.com/reel/{rid}")
    if data['aria']: print(f"  Aria-label: {data['aria']}")
    if data['text']: print(f"  Text: {data['text'][:100]}")
    if data['img']: print(f"  Thumbnail: {data['img'][:80]}...")

