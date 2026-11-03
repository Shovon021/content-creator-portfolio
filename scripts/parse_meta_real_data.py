import re
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

out_lines = []

def log(msg):
    print(msg, flush=True)
    out_lines.append(str(msg))

for filename in ['(1) Dear Ekra Reels _ Facebook.html', 'Facebook.html']:
    if not os.path.exists(filename):
        continue
    log(f"\n==========================================")
    log(f"FILE: {filename}")
    log(f"==========================================")
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    log(f"Size: {len(content) / 1024 / 1024:.2f} MB")

    # 1. Look for Exact Followers / Likes / Bio
    # Often in JSON payloads like {"__typename":"User","name":"Dear Ekra",...} or aria-labels
    # Search for "followers" in chunks
    follower_contexts = []
    for m in re.finditer(r'followers', content, re.IGNORECASE):
        idx = m.start()
        snippet = content[max(0, idx - 100):min(len(content), idx + 100)]
        clean = re.sub(r'<[^>]+>', ' ', snippet)
        clean = ' '.join(clean.split())
        follower_contexts.append(clean)

    log(f"\nFound {len(follower_contexts)} mentions of 'followers'. Top snippets:")
    for snip in list(set(follower_contexts))[:12]:
        log(f"  * {snip}")

    # 2. Search for Reels data
    # Look for /reel/<id>
    reel_ids = list(dict.fromkeys(re.findall(r'/reel/(\d+)', content)))
    log(f"\nTotal Unique Reel IDs: {len(reel_ids)}")
    log(f"Reel IDs sample: {reel_ids[:10]}")

    # 3. Search for Views patterns: e.g. "1.2M", "517K", "321K", "2.4M", "275K"
    view_matches = re.findall(r'(\d+[\d\.]*[KMkm])\s*(?:views|plays|reactions)', content, re.IGNORECASE)
    log(f"\nExplicit view/play mentions: {set(view_matches)}")

    # 4. Search for Brand names
    brands_to_check = [
        "Sultan", "Japan Bazar", "Marshmallow", "Basecamp", "Igloo",
        "Artistyan", "PaiMart", "Dentflix", "HER Studio", "Cake Town",
        "Alvin", "Tehani", "Twist", "6sence", "ChildrenGoods", "Elhoe"
    ]
    log(f"\nBrand mentions in {filename}:")
    for b in brands_to_check:
        cnt = len(re.findall(re.escape(b), content, re.IGNORECASE))
        log(f"  * {b}: {cnt} occurrences")

with open('scripts/meta_real_data_summary.txt', 'w', encoding='utf-8') as out:
    out.write('\n'.join(out_lines))

log("\nWrote scripts/meta_real_data_summary.txt successfully!")

