import re

with open("Facebook.html", "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

# Check what URL this page was saved from
url_match = re.search(r'saved from url=\(\d+\)(https?://[^\s>]+)', html)
if url_match:
    print("Saved from URL:", url_match.group(1))

# Check canonical or alternate links
for l in re.findall(r'<link[^>]+(?:canonical|alternate)[^>]+>', html):
    print("Link:", l)

# Check for header text or main banner
h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
print("H1 tags:", [re.sub(r'<[^>]+>', ' ', h).strip() for h in h1s])

# Check follower counts or numbers
counts = re.findall(r'(\d[\d,.]*\s*(?:followers|following|likes|k followers|k likes))', html, re.IGNORECASE)
print("Counts found:", list(set(counts)))

# Search for posts / timeline content
print("\n--- TIMELINE POST TEXT BLOCKS ---")
# Look for aria-label="Timeline" or post bodies
for m in re.finditer(r'data-ad-preview="message"[^>]*>(.*?)</div>', html, re.DOTALL):
    print("Post Preview:", re.sub(r'<[^>]+>', ' ', m.group(1)).strip())

# Look for spans containing Bengali characters
bengali_spans = []
for span in re.findall(r'<span[^>]*>([^<]*[\u0980-\u09FF][^<]*)</span>', html):
    txt = span.strip()
    if len(txt) > 10 and txt not in bengali_spans:
        bengali_spans.append(txt)

print(f"\nBengali Spans ({len(bengali_spans)} total):")
for b in bengali_spans[:15]:
    print(" •", b)

