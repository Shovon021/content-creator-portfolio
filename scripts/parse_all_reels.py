import re
import json

with open('(1) Dear Ekra Reels _ Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Pattern for reels:
# href="https://www.facebook.com/reel/(\d+)[^"]*"
# followed by src="([^"]+)"
# followed by Eye SVG and <span ...>([\d\.]+[KMkm]?)</span>

pattern = re.compile(
    r'href="https://www\.facebook\.com/reel/(\d+)[^"]*"[^>]*>'
    r'<img[^>]*src="([^"]+)"[^>]*>.*?'
    r'<svg[^>]*>.*?</svg>.*?<span[^>]*><span[^>]*>([0-9\.]+[KMkm]?)</span>',
    re.DOTALL
)

matches = pattern.findall(text)
print(f"Total structured reels found: {len(matches)}")

reels_data = []
for rid, img, views in matches:
    reels_data.append({
        'id': rid,
        'url': f'https://www.facebook.com/reel/{rid}',
        'img': img,
        'views': views
    })

# Convert views string to number for sorting: e.g. 1.2M -> 1200000, 321K -> 321000, 850 -> 850
def parse_views_num(v_str):
    v = v_str.upper().strip()
    if v.endswith('M'):
        return float(v[:-1]) * 1_000_000
    elif v.endswith('K'):
        return float(v[:-1]) * 1_000
    try:
        return float(v)
    except:
        return 0

reels_data.sort(key=lambda r: parse_views_num(r['views']), reverse=True)

print("\n--- TOP 35 ALL-TIME MOST VIEWED REELS (FROM ACTUAL FACEBOOK DATA) ---")
for i, r in enumerate(reels_data[:35], 1):
    print(f"#{i}: {r['views']:>6} views | URL: {r['url']} | Img: {r['img']}")

# View count distribution
millions = [r for r in reels_data if parse_views_num(r['views']) >= 1_000_000]
hundred_k = [r for r in reels_data if 100_000 <= parse_views_num(r['views']) < 1_000_000]
ten_k = [r for r in reels_data if 10_000 <= parse_views_num(r['views']) < 100_000]
under_10k = [r for r in reels_data if parse_views_num(r['views']) < 10_000]

print(f"\n--- REEL REACH DISTRIBUTION ---")
print(f"Total reels parsed: {len(reels_data)}")
print(f"Reels with 1M+ views: {len(millions)}")
print(f"Reels with 100K - 999K views: {len(hundred_k)}")
print(f"Reels with 10K - 99K views: {len(ten_k)}")
print(f"Reels under 10K views: {len(under_10k)}")

with open('scripts/all_verified_facebook_reels.json', 'w', encoding='utf-8') as out:
    json.dump(reels_data, out, indent=2)

print("\nWrote scripts/all_verified_facebook_reels.json successfully!")

