import re
import json

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Let's search for reel IDs or video elements or objects in Facebook.html
# In Facebook HTML, videos are often defined in JSON structures with "playable_url", "browser_native_sd_url", "browser_native_hd_url", or inside video blocks
sd_urls = re.findall(r'"browser_native_sd_url":"([^"]+)"', html)
hd_urls = re.findall(r'"browser_native_hd_url":"([^"]+)"', html)
playable_urls = re.findall(r'"playable_url":"([^"]+)"', html)

print(f'Found: {len(sd_urls)} SD URLs, {len(hd_urls)} HD URLs, {len(playable_urls)} playable URLs')

# Also search for reel permalinks / IDs
reels = re.findall(r'/reel/(\d+)', html)
print(f'Found {len(set(reels))} unique reel IDs in HTML: {list(set(reels))[:10]}')

# Look for blocks that tie reel ID or caption to video url
# Let's find occurrences of ".mp4" and look at surrounding text
mp4_matches = re.finditer(r'https?://[^\x22\x27\s<>]+\.mp4[^\x22\x27\s<>]*', html)
contexts = []
for m in mp4_matches:
    start = max(0, m.start() - 300)
    end = min(len(html), m.end() + 300)
    snippet = html[start:end]
    # see if snippet has reel or title or brand name
    reel_id = re.findall(r'reel[/\\]+(\d+)', snippet) or re.findall(r'(\d{10,20})', snippet)
    contexts.append({
        'url': m.group(0).replace(r'\/', '/').replace('&amp;', '&'),
        'reels_nearby': reel_id[:3]
    })

print(f'Extracted {len(contexts)} video contexts')
with open('scripts/fb_video_map.json', 'w', encoding='utf-8') as out:
    json.dump(contexts, out, indent=2)

