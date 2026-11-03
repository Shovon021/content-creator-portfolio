import re
import json

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

# Let's inspect where .mp4 URLs appear and find the surrounding JSON or HTML
matches = [m.start() for m in re.finditer(r'\.mp4', txt)]
print(f'Total .mp4 occurrences: {len(matches)}')

samples = []
for idx in matches[:5]:
    start = max(0, idx - 400)
    end = min(len(txt), idx + 400)
    samples.append(txt[start:end])

with open('scripts/mp4_samples.txt', 'w', encoding='utf-8') as out:
    out.write("\n====================\n".join(samples))

print('Saved samples to scripts/mp4_samples.txt')

