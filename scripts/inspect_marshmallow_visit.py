import re

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

pos = 10595191
chunk = html[pos-1500:pos+2500]
print("Marshmallow visit context:")
clean = ' '.join(re.sub(r'<[^>]+>', ' ', chunk).split())
print("Clean text:", clean)

ids = re.findall(r'/(?:reel|videos)/(\d+)', chunk)
print("Reel/Video links:", ids)
any_ids = re.findall(r'\b\d{15,16}\b', chunk)
print("15-16 digit IDs:", any_ids)

posters = re.findall(r'poster="([^"]+)"', chunk)
print("Posters:", posters)

