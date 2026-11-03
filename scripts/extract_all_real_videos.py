import re
import json

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

# Replace unicode escapes for brackets
txt_clean = txt.replace(r'\u003C', '<').replace(r'\u003c', '<').replace(r'\u003E', '>').replace(r'\u003e', '>')

# Find all BaseURL matches
base_urls = re.findall(r'<BaseURL>(https:[^<]+?\.mp4[^<]*?)</BaseURL>', txt_clean)
print(f'Found {len(base_urls)} BaseURL tags with .mp4')

video_map = {}
for u in base_urls:
    u_clean = u.replace(r'\/', '/').replace('&amp;', '&')
    vid_match = re.search(r'video_id[":=]+(\d+)', u_clean)
    vid_id = vid_match.group(1) if vid_match else 'unknown'
    
    is_video = 'audio' not in u_clean and 'heaac' not in u_clean
    if is_video:
        if vid_id not in video_map:
            video_map[vid_id] = []
        video_map[vid_id].append(u_clean)

print(f'Found {len(video_map)} unique video_ids with real video streams!')
for vid, urls in list(video_map.items()):
    print(f'video_id: {vid} has {len(urls)} stream variants')

with open('scripts/parsed_real_videos.json', 'w', encoding='utf-8') as out:
    json.dump(video_map, out, indent=2)
