import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_file = 'Facebook.html'
with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

posts = [
    ("Marshmallow Tech", 7051016),
    ("COZY Cafe", 5908906),
    ("PaiMart", 5289995),
    ("Dentflix Dentistry", 18950713),
    ("Air Force BASECAMP", 6158908),
    ("Dr. Alvin", 5026667),
    ("Cake Town BD", 19170918),
    ("HER Studio & Salon", 5733105)
]

for name, pos in posts:
    print(f"\n==================== {name} (pos {pos}) ====================")
    start = max(0, pos - 4000)
    end = min(len(html), pos + 4000)
    chunk = html[start:end]
    
    # Links
    links = re.findall(r'href="([^"]+)"', chunk)
    interesting_links = [l for l in links if any(k in l for k in ['/reel/', '/videos/', '/posts/', 'story.php', 'permalink', 'watch'])]
    print("Links:")
    for l in list(set(interesting_links))[:5]:
        print("  ", l[:120])
        
    # Images
    imgs = re.findall(r'src="([^"]+)"', chunk)
    clean_imgs = [i for i in imgs if not i.endswith('.svg') and not 'emoji' in i and not 'rsrc.php' in i]
    print("Images/Posters:")
    for i in list(set(clean_imgs))[:6]:
        print("  ", i[:140])
        
    # Poster attributes in video tags
    posters = re.findall(r'poster="([^"]+)"', chunk)
    if posters:
        print("Video posters:")
        for p in list(set(posters)):
            print("  ", p[:140])
