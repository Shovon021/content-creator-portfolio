import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

pos = 5289995
chunk = html[pos-3000:pos+4000]

print("Reels/Videos:", re.findall(r'/(?:reel|videos)/(\d+)', chunk))
print("15-16 digit IDs:", re.findall(r'\b\d{15,16}\b', chunk))

