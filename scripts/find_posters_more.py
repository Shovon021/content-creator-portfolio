import re

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

for term in ['Marshmallow', 'COZY Cafe', 'cozy']:
    for m in re.finditer(re.escape(term), html, re.IGNORECASE):
        pos = m.start()
        # scan forward 15000 chars for <video poster="..." or <img src="..."
        window = html[pos:pos+15000]
        posters = re.findall(r'poster="([^"]+)"', window)
        fbcdn_imgs = re.findall(r'src="(https://scontent[^\"]+)"', window)
        local_imgs = re.findall(r'src="(\./[^"]+\.(?:jpg|png|webp))"', window)
        print(f"Term '{term}' at {pos}:")
        if posters:
            print("  Video posters:", posters[:2])
        if fbcdn_imgs:
            print("  FBCDN imgs:", fbcdn_imgs[:2])
        if local_imgs:
            print("  Local imgs:", local_imgs[:2])

