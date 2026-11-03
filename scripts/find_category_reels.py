import json
import os
import shutil
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/matched_reels.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)

print(f"Total matched items: {len(matched)}")

targets = {
    'sultans_dine': ['sultan'],
    'ayeshas_gallery': ['ayesha'],
    'tehani_tea': ['tehani'],
    'elhoe': ['elhoe'],
    'innsaei': ['innsaei'],
    'echo_app': ['echo is a mobile application', 'travel partners'],
    'campus_commute': ['2 hours away', 'universitylife', '4204754379787761'],
    'sylhet_tour': ['sylhet'],
    'bandarban': ['bandarban'],
    'artistyan': ['artistyan'],
    'cake_town': ['cake town', 'caketown'],
    'children_goods': ['childrengoods']
}

for key, kws in targets.items():
    found = []
    for item in matched:
        blob = (item.get('fb_snippet') or '') + ' ' + (item.get('views_or_text') or '')
        blob_lower = blob.lower()
        if any(kw.lower() in blob_lower for kw in kws) or (item.get('reel_id') in kws):
            found.append(item)
    print(f"\nTarget: {key} -> found {len(found)}")
    for it in found[:3]:
        rid = it.get('reel_id')
        img = it.get('img_path')
        print(f"  ID: {rid} | img: {img} (exists: {it.get('img_exists')})")
        snip = (it.get('fb_snippet') or '')[:100].replace('\n', ' ')
        try:
            print(f"  Snippet: {snip}")
        except Exception:
            pass
        if img and os.path.exists(img) and not os.path.exists(f"public/thumbnails/{key}.jpg"):
            dst = f"public/thumbnails/{key}.jpg"
            shutil.copy2(img, dst)
            print(f"  -> Copied to {dst}")
