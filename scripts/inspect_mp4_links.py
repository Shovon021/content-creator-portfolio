import re

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

mp4s = list(set(re.findall(r'https?://[^\s"\'<>]+\.mp4[^\s"\'<>]*', txt)))
print(f"Unique mp4 links: {len(mp4s)}")
for i, u in enumerate(mp4s[:10]):
    print(f"{i+1}: {u}")

