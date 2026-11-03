import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

terms = ['japan', 'japan bazar', 'japan bazaar', 'bazar', 'bazaar', 'জাপান', 'বাজার']

for filename in ['Facebook.html', '(1) Dear Ekra Reels _ Facebook.html']:
    try:
        with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        print(f"\n==================== File: {filename} ====================")
        for term in terms:
            matches = [m.start() for m in re.finditer(re.escape(term), content, re.IGNORECASE)]
            print(f"Term '{term}': {len(matches)} occurrences")
            for pos in matches[:4]:
                chunk = content[max(0, pos-250):min(len(content), pos+350)]
                clean = ' '.join(re.sub(r'<[^>]+>', ' ', chunk).split())
                print(f"  [{pos}]: {clean}")
    except Exception as e:
        print(f"Error reading {filename}: {e}")

