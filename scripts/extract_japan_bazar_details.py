import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

posts = [
    ("Lion Pair Acne Cream", 19053384),
    ("Authentic Skincare Sunscreen", 21980983),
    ("Made in Japan Hair Care Collab", 22094234),
    ("Winter UV Sunscreen Collab", 22352898)
]

for title, pos in posts:
    print(f"\n{'='*20} {title} (pos {pos}) {'='*20}")
    start = max(0, pos - 1500)
    end = min(len(html), pos + 4000)
    chunk = html[start:end]
    
    # Clean text
    clean = ' '.join(re.sub(r'<[^>]+>', ' ', chunk).split())
    print("Text snippet:\n", clean[:600])
    
    # Images in chunk
    imgs = re.findall(r'src="([^"]+?\.(?:jpg|png|webp))"', chunk)
    clean_imgs = [i for i in imgs if not 'svg' in i and not 'emoji' in i and not 'rsrc' in i]
    print("\nImages found:")
    for img in list(set(clean_imgs))[:5]:
        print(" ", img)
        
    # Videos/Posters
    vids = re.findall(r'<video[^>]+>', chunk)
    posters = re.findall(r'poster="([^"]+)"', chunk)
    reels = re.findall(r'/(?:reel|videos|posts)/(\d+)', chunk)
    
    print("\nReels/Posts/Videos IDs:", set(reels))
    print("Video tags count:", len(vids))
    if posters:
        print("Posters:", posters[:2])

