import json
import re

with open('scripts/all_reels_parsed.json', 'r', encoding='utf-8') as f:
    reels = json.load(f)

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    fb_html = f.read()

print("Loaded Facebook.html, length:", len(fb_html))

matched_reels = []
for r in reels:
    rid = r['reel_id']
    # search rid in Facebook.html
    pos = fb_html.find(rid)
    if pos != -1:
        # extract context around rid
        start = max(0, pos - 1500)
        end = min(len(fb_html), pos + 2500)
        chunk = fb_html[start:end]
        
        # clean text
        clean = re.sub(r'<[^>]+>', ' ', chunk)
        clean = ' '.join(clean.split())
        
        # Look for post text or message
        r['found_in_fb'] = True
        r['fb_snippet'] = clean[:400]
        matched_reels.append(r)
    else:
        r['found_in_fb'] = False

print(f"Matched {len(matched_reels)} reels in Facebook.html timeline!")

with open('scripts/matched_reels.json', 'w', encoding='utf-8') as f:
    json.dump(matched_reels, f, indent=2, ensure_ascii=False)

for m in matched_reels[:20]:
    print(f"Reel {m['reel_id']} ({m['views_or_text']}): {m['fb_snippet'][:120]}")
    print(f"   Img: {m['img_path']}")
    print("-" * 50)

