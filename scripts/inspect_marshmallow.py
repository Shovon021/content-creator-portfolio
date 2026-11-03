import re

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

for pos in [7051016, 10595191]:
    chunk = html[pos-500:pos+1500]
    clean = ' '.join(re.sub(r'<[^>]+>', ' ', chunk).split())
    ids = re.findall(r'\b\d{15,16}\b', chunk)
    print(f"Pos {pos}:")
    print("  Clean:", clean[:300])
    print("  IDs:", ids)

