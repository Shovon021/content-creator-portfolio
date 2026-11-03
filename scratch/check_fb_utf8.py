import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

with open("Facebook.html", "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

print("File Size:", len(html))

# URL
url_match = re.search(r'saved from url=\(\d+\)(https?://[^\s>]+)', html)
print("Saved from URL:", url_match.group(1) if url_match else "N/A")

# Post Previews with emoji support
print("\n--- TIMELINE POSTS ---")
matches = list(re.finditer(r'data-ad-preview="message"[^>]*>(.*?)</div>', html, re.DOTALL))
print(f"Total data-ad-preview posts: {len(matches)}")

for i, m in enumerate(matches[:15], 1):
    clean = re.sub(r'<[^>]+>', ' ', m.group(1)).strip()
    clean = re.sub(r'\s+', ' ', clean)
    print(f"\n[Post {i}]")
    print(clean)

# Look for additional post text inside relay JSON
print("\n--- RELAY POST BODIES ---")
post_texts = []
for m in re.finditer(r'"message":{"text":"([^"]+)"', html):
    raw = m.group(1)
    try:
        decoded = raw.encode('utf-8').decode('unicode_escape')
        if len(decoded) > 15 and decoded not in post_texts:
            post_texts.append(decoded)
    except:
        pass

for i, pt in enumerate(post_texts[:10], 1):
    print(f"\n[Relay Post {i}]")
    print(pt)

