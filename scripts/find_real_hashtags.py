import re
import sys
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

for fname in ['(1) Dear Ekra Reels _ Facebook.html', 'Facebook.html']:
    with open(fname, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    # Find real hashtags (exclude 3-hex and 6-hex/8-hex color codes)
    raw_tags = re.findall(r'#([A-Za-z\u0980-\u09FF][A-Za-z0-9_\u0980-\u09FF]*)', text)
    hex_pattern = re.compile(r'^[0-9a-fA-F]{3,8}$')
    real_tags = [t.lower() for t in raw_tags if not hex_pattern.match(t)]

    print(f"\n==========================================")
    print(f"REAL HASHTAGS IN {fname}: (Total {len(real_tags)})")
    print(f"==========================================")
    counts = Counter(real_tags)
    for tag, c in counts.most_common(25):
        print(f"  #{tag}: {c}")

    # Also search for Facebook category and topic tags
    topics = re.findall(r'"category_name":"([^"]+)"', text)
    if topics:
        print(f"\nCategory names in {fname}:", Counter(topics).most_common(15))
