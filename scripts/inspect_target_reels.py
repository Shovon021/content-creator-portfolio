import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    fb_html = f.read()

target_reels = [
    '9692580367418682', # 2.4M
    '642419852161368',  # 1.3M
    '1234450435028334', # 1.2M
    '617952144332784',  # 1.0M
    '102850179453514',  # 1.0M
    '4204754379787761', # 517K
    '2018298545546153', # 321K (COZY Cafe)
    '1667916158091474', # Marshmallow Tech
    '1429319522018754', # PaiMart
    '820782080973524',  # Dentflix
    '1439638384825625', # Basecamp
    '2438339133361816', # Dr Alvin
]

with open('scripts/all_reels_parsed.json', 'r', encoding='utf-8') as f:
    all_reels = {r['reel_id']: r for r in json.load(f)}

print("=== INSPECTING TARGET REELS ===")
for rid in target_reels:
    meta = all_reels.get(rid, {})
    print(f"\nREEL ID: {rid} | Views: {meta.get('views_or_text')} | Img: {meta.get('img_path')}")
    
    # find where rid occurs in fb_html
    matches = [m.start() for m in re.finditer(rid, fb_html)]
    print(f"  Found {len(matches)} occurrences in Facebook.html")
    for pos in matches[:2]:
        chunk = fb_html[max(0, pos-600):min(len(fb_html), pos+1500)]
        clean = ' '.join(re.sub(r'<[^>]+>', ' ', chunk).split())
        print(f"  Context: {clean[:250]}")

# Also let's find Cake Town BD and HER Studio in all_reels
print("\n=== SEARCHING FOR CAKE TOWN & HER STUDIO REELS ===")
for term in ['Cake Town', 'caketown', 'HER Studio', 'her studio', 'salon']:
    matches = [m.start() for m in re.finditer(re.escape(term), fb_html, re.IGNORECASE)]
    print(f"Term '{term}': {len(matches)} matches")
    for pos in matches[:2]:
        chunk = fb_html[max(0, pos-400):min(len(fb_html), pos+1200)]
        clean = ' '.join(re.sub(r'<[^>]+>', ' ', chunk).split())
        reels = re.findall(r'/(?:reel|videos)/(\d+)', chunk)
        imgs = re.findall(r'src="([^"]+\.jpg)"', chunk)
        print(f"  Clean: {clean[:200]}")
        print(f"  Reels: {reels} | Imgs: {imgs[:2]}")

