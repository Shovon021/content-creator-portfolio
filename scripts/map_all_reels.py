import re
import json

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Let's search for every permalink_url with /reel/
reels_found = {}

# Find all blocks with permalink_url /reel/<id>
matches = re.finditer(r'permalink_url["\s:]+https?:[\\/]+(?:www\.)?facebook\.com[\\/]+reel[\\/]+(\d+)', text)
for m in matches:
    reel_id = m.group(1)
    # Search around this match for BaseURL or .mp4
    start = max(0, m.start() - 4000)
    end = min(len(text), m.end() + 8000)
    block = text[start:end]
    
    # Find BaseURL tags inside this block
    urls = re.findall(r'BaseURL>(https:[^<]+?\.mp4[^<]*?)(?:\\u003C|&lt;|<)', block)
    video_urls = [u.replace(r'\/', '/').replace('&amp;', '&') for u in urls if 'audio' not in u and 'heaac' not in u]
    
    if reel_id not in reels_found:
        reels_found[reel_id] = []
    for vu in video_urls:
        if vu not in reels_found[reel_id]:
            reels_found[reel_id].append(vu)

print(f'Total reels with video URLs found via permalink: {len(reels_found)}')
for r_id, urls in list(reels_found.items())[:10]:
    print(f'Reel {r_id}: {len(urls)} video URLs')

# Also search by video_id in the URL itself
all_base_urls = re.findall(r'BaseURL>(https:[^<]+?\.mp4[^<]*?)(?:\\u003C|&lt;|<)', text)
for u in all_base_urls:
    u_clean = u.replace(r'\/', '/').replace('&amp;', '&')
    if 'audio' not in u_clean and 'heaac' not in u_clean:
        vid_match = re.search(r'video_id[":=]+(\d+)', u_clean)
        if vid_match:
            v_id = vid_match.group(1)
            if v_id not in reels_found:
                reels_found[v_id] = []
            if u_clean not in reels_found[v_id]:
                reels_found[v_id].append(u_clean)

print(f'Total reels / video_ids mapped: {len(reels_found)}')
with open('scripts/all_reels_video_urls.json', 'w', encoding='utf-8') as out:
    json.dump(reels_found, out, indent=2)

