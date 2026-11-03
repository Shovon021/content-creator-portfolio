import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

posts = [
    ("Post 1: Lion Pair Acne Cream", 19053384),
    ("Post 2: Authentic Skincare & Sunscreen", 21980983),
    ("Post 3: Made in Japan Hair Care Collab", 22094234),
    ("Post 4: Winter UV Sunscreen Collab", 22352898)
]

for title, pos in posts:
    print(f"\n{'='*25}\n{title}\n{'='*25}")
    chunk = html[pos:pos+3500]
    clean = ' '.join(re.sub(r'<[^>]+>', ' ', chunk).split())
    # find where next post or divider begins
    print(clean[:1000])

