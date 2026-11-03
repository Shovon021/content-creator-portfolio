import re

for fn in ['(1) Dear Ekra Reels _ Facebook.html', 'Facebook.html']:
    with open(fn, 'r', encoding='utf-8', errors='ignore') as f:
        txt = f.read()
    mp4s = re.findall(r'https?://[^\s"\'<>]+\.mp4[^\s"\'<>]*', txt)
    print(f'{fn}: found {len(mp4s)} mp4 links')
    for u in mp4s[:3]:
        print('   ', u[:100])

