import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/matched_reels.json', 'r', encoding='utf-8') as f:
    reels = json.load(f)

print(f"Total matched reels: {len(reels)}")

lines = []
for r in reels:
    snip = r['fb_snippet']
    # extract words
    clean = ' '.join(snip.split())
    lines.append({
        'reel_id': r['reel_id'],
        'views': r['views_or_text'],
        'img': r['img_path'],
        'exists': r['img_exists'],
        'text': clean
    })

with open('scripts/matched_reels_summary.txt', 'w', encoding='utf-8') as f:
    for item in lines:
        f.write(f"ID: {item['reel_id']} | Views: {item['views']} | Img: {item['img']} (exists: {item['exists']})\n")
        f.write(f"Text: {item['text'][:300]}\n")
        f.write("-" * 80 + "\n")

print("Wrote scripts/matched_reels_summary.txt")

