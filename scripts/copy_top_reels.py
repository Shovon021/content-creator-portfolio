import json
import os
import shutil

with open('scripts/all_verified_facebook_reels.json', 'r', encoding='utf-8') as f:
    reels = json.load(f)

print("Checking top 15 reel images:")
os.makedirs('public/thumbnails/reels', exist_ok=True)

for i, r in enumerate(reels[:15], 1):
    src = r['img'].replace('./', '')
    if os.path.exists(src):
        v = r['views']
        rid = r['id']
        dst = f"public/thumbnails/reels/top_{i}_{v}_{rid}.jpg"
        shutil.copy2(src, dst)
        print(f"  #{i}: {v:>6} views (ID: {rid}) -> {dst}")
    else:
        print(f"  #{i}: {r['views']} -> NOT FOUND: {src}")

