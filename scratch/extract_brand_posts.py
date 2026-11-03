import re
import sys

with open("Facebook.html", "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

matches = list(re.finditer(r'data-ad-preview="message"[^>]*>(.*?)</div>', html, re.DOTALL))

print(f"Total posts: {len(matches)}")
print("--- DETAILED REAL COLLABORATIONS EXTRACTED ---")

seen = set()
for m in matches:
    clean = re.sub(r'<[^>]+>', ' ', m.group(1)).strip()
    clean = re.sub(r'\s+', ' ', clean)
    if len(clean) > 20 and clean not in seen:
        seen.add(clean)
        if any(k in clean.lower() for k in ['cafe', 'restaurant', 'salon', 'resort', 'basecamp', 'paimart', 'sreemangal', 'উত্তরা', 'university', 'soap', 'opening', 'ভিজিট', 'দারুণ', 'shop', 'মিউজিয়াম']):
            # Print using escaped or safe UTF-8
            safe = clean.encode('ascii', 'backslashreplace').decode('ascii')
            sys.stdout.buffer.write((f"\n• " + clean + "\n").encode('utf-8'))
