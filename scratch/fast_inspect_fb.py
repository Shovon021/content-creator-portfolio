import re

file_path = "Facebook.html"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

print(f"File Size: {len(html)} bytes")

# Title
title = re.search(r'<title>(.*?)</title>', html)
print("Title:", title.group(1) if title else "N/A")

# Open Graph tags
print("\n--- OPEN GRAPH METADATA ---")
for meta in re.findall(r'<meta[^>]+property=["\']og:[^>]+>', html):
    print(meta)

# Search for specific recognizable profile patterns
print("\n--- BIO & INTRO ---")
for m in re.finditer(r'Welcome to Dear Ekra[^\"]+', html):
    print("Found Bio:", m.group(0)[:200])
    break

# External accounts
print("\n--- CONNECTED ACCOUNTS ---")
for match in re.findall(r'instagram\.com/[a-zA-Z0-9_.]+', html):
    print("Instagram:", match)
for match in re.findall(r'youtube\.com/@[a-zA-Z0-9_.]+', html):
    print("YouTube:", match)

# Timeline Post IDs & snippets
print("\n--- POSTS ON THIS PAGE ---")
posts = set(re.findall(r'/posts/(\d+)', html) + re.findall(r'/story\.php\?story_fbid=(\d+)', html) + re.findall(r'story_fbid=([a-zA-Z0-9_]+)', html))
print("Post IDs found:", list(posts)[:10])

# Post timestamps or readable text
# Let's search for text near "Dear Ekra" in feed
snippets = []
for m in re.finditer(r'"text":"([^"]{20,150})"', html):
    t = m.group(1)
    if not t.startswith('\\u') and not any(k in t for k in ['http', 'width', 'height', 'style', 'class', 'label', 'false', 'true']):
        snippets.append(t)
    elif any(k in t for k in ['শনিবার', 'শুক্রবার', 'ক্যাফে', 'রেস্তোরাঁ', 'রেজিস্ট্রেশন', 'ভিডিও', 'অফার', 'খাবার']):
        try:
            snippets.append(t.encode('utf-8').decode('unicode_escape'))
        except:
            pass

print(f"\nReadable Text Snippets ({len(snippets)} total):")
for s in list(dict.fromkeys(snippets))[:15]:
    print(" •", s)

