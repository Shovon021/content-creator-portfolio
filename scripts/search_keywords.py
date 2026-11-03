import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/matched_reels_summary.txt', 'r', encoding='utf-8') as f:
    text = f.read()

entries = text.split('-'*80)
print('Total entries:', len(entries))

found = []
for e in entries:
    lower = e.lower()
    for kw in ['marshmallow', 'cozy', 'paimart', 'painest', 'dentflix', 'basecamp', 'alvin', 'cake town', 'her studio', 'anime', 'gadget', '1.2m', '1m', '1.3m', '2.4m', '321k', '517k']:
        if kw in lower:
            found.append((kw, e.strip()))
            break

print(f"Found {len(found)} matching entries:")
for kw, item in found:
    print(f"\n>>> MATCH [{kw}] <<<")
    print(item)

