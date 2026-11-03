import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/matched_reels_summary.txt', 'r', encoding='utf-8') as f:
    text = f.read()

entries = text.split('-'*80)
for e in entries:
    if 'lion' in e.lower() or 'pair' in e.lower() or 'japan' in e.lower():
        print("="*40)
        print(e.strip())

