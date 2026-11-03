import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

pos = 5733105
chunk = html[pos-3000:pos+4000]

print("Reels/Videos:", re.findall(r'/(?:reel|videos)/(\d+)', chunk))
print("15-16 digit IDs:", re.findall(r'\b\d{15,16}\b', chunk))
print("All image sources:")
for img in re.findall(r'src="([^"]+)"', chunk):
    if not 'svg' in img and not 'emoji' in img and not 'rsrc' in img:
        print("  ", img[:120])

print("All video tags:")
for v in re.findall(r'<video[^>]+>', chunk):
    print("  ", v[:150])

