import urllib.request
import re

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

mp4s = list(set(re.findall(r'https?://[^\s"\'<>]+\.mp4[^\s"\'<>]*', txt)))
print('Total mp4 URLs:', len(mp4s))
if mp4s:
    url = mp4s[0].replace('&amp;', '&')
    print('Testing URL:', url[:80])
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read(1024)
            print('Downloaded bytes:', len(data))
    except Exception as e:
        print('Error:', e)

