import re

with open('(1) Dear Ekra Reels _ Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Look for reel anchors and nearby numbers
# e.g. href=".../reel/(\d+)..." followed or preceded by numbers
reel_matches = []
for m in re.finditer(r'/reel/(\d+)', text):
    rid = m.group(1)
    idx = m.start()
    chunk = text[max(0, idx - 400):min(len(text), idx + 800)]
    
    # search for metrics like 12K, 321K, 1.2M, 2.4M, etc.
    counts = re.findall(r'>(\d+[\d\.]*[KMkm])<', chunk)
    plays = re.findall(r'(\d+[\d\.]*[KMkm]?)\s*(?:plays|views|view)', chunk, re.IGNORECASE)
    
    clean = re.sub(r'<[^>]+>', ' ', chunk)
    clean = ' '.join(clean.split())
    
    if counts or plays:
        reel_matches.append((rid, counts + plays, clean[:150]))

print(f"Total matches with counts: {len(reel_matches)}")
for rid, c, cl in reel_matches[:20]:
    print(f"Reel {rid}: {c} -> {cl}")

