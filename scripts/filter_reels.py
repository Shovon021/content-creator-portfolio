import json

with open('scripts/all_reels_parsed.json', 'r', encoding='utf-8') as f:
    reels = json.load(f)

print(f"Total reels: {len(reels)}")

# Top reels with 'M' (millions) or > 50K
top_reels = []
for r in reels:
    v = r['views_or_text']
    if 'M' in v:
        top_reels.append(r)
    elif 'K' in v:
        try:
            num = float(v.replace('K', '').strip())
            if num >= 20: # 20k or higher
                top_reels.append(r)
        except:
            pass

print(f"Top reels count: {len(top_reels)}")
for r in top_reels:
    print(f"ID: {r['reel_id']:<18} | Views: {r['views_or_text']:<6} | Exists: {str(r['img_exists']):<5} | Img: {r['img_path']}")

