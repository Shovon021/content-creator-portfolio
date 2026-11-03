import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

for filename in ['Facebook.html', '(1) Dear Ekra Reels _ Facebook.html']:
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    
    matches = [m.start() for m in re.finditer(r'japanbazar|japan bazar', html, re.IGNORECASE)]
    print(f"\nFile: {filename} -> Found {len(matches)} matches for 'japanbazar'/'japan bazar'")
    for pos in matches:
        start = max(0, pos - 1500)
        end = min(len(html), pos + 2500)
        chunk = html[start:end]
        clean = ' '.join(re.sub(r'<[^>]+>', ' ', chunk).split())
        
        # look for reels or video links
        reels = re.findall(r'/(?:reel|videos)/(\d+)', chunk)
        imgs = re.findall(r'src="([^"]+\.jpg)"', chunk)
        posters = re.findall(r'poster="([^"]+)"', chunk)
        
        print(f"\nMatch at pos {pos}:")
        print("  Clean text snippet:", clean[:400])
        print("  Reels:", set(reels))
        print("  Imgs:", set(imgs))
        print("  Posters:", set(posters))

