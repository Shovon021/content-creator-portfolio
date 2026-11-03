import re
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def analyze_reels_page(html_path):
    print(f"\n==========================================")
    print(f"ANALYZING: {html_path}")
    print(f"==========================================")
    if not os.path.exists(html_path):
        print(f"File not found: {html_path}")
        return

    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()

    print(f"File size: {len(html) / 1024 / 1024:.2f} MB")

    # 1. Search for Followers & Likes
    # Look for patterns like "16K followers", "16,420 followers", "followers" in aria-labels, text, JSON payloads
    follower_patterns = [
        r'(\b\d+[\d,\.]*\s*[KkMm]?\s*followers\b)',
        r'(\b\d+[\d,\.]*\s*[KkMm]?\s*following\b)',
        r'(\b\d+[\d,\.]*\s*[KkMm]?\s*likes\b)',
        r'"follower_count":\s*(\d+)',
        r'"followers":\s*\{[^}]*"count":\s*(\d+)',
        r'"formatted_follower_count":\s*"([^"]+)"'
    ]

    print("\n--- FOLLOWER & PROFILE METRICS ---")
    for pat in follower_patterns:
        m = re.findall(pat, html, re.IGNORECASE)
        if m:
            print(f"Pattern '{pat}': {set(m[:10])}")

    # 2. Search for Bio / Intro details
    print("\n--- BIO & INTRO STRINGS ---")
    bio_matches = re.findall(r'"intro_card"[^}]*"text":\s*"([^"]+)"', html)
    if bio_matches:
        print("Intro card:", bio_matches)
    
    # Generic bio / intro text search
    intro_candidates = re.findall(r'([^\n<>"{}]{10,80}(?:Creator|Promoter|Video|Dhaka|collaborat|contact)[^\n<>"{}]{10,80})', html, re.IGNORECASE)
    for c in list(set(intro_candidates))[:10]:
        print("Candidate intro:", c.strip())

    # 3. Extract all Reels and View Counts
    print("\n--- EXTRACTING ALL REELS & VIEWS ---")
    
    # In Facebook Reels HTML, reels usually appear as /reel/<id> with play count or aria-label
    # Examples: aria-label="... plays" or text like "1.2M", "517K", "321K" inside reel cards
    reel_blocks = re.findall(r'/reel/(\d+)', html)
    unique_reels = list(dict.fromkeys(reel_blocks))
    print(f"Total Unique Reel IDs Found: {len(unique_reels)}")

    # Let's inspect contexts around reel IDs to find views, titles, thumbnails
    reel_data = []
    for r_id in unique_reels:
        pos = html.find(f'/reel/{r_id}')
        if pos != -1:
            chunk = html[max(0, pos - 1500):min(len(html), pos + 2500)]
            
            # Find view counts (e.g. 2.4M, 517K, 12K, 321K, 1.4K, 857, etc.)
            # Common FB patterns: "2.4M plays", "517K views", or span with number
            views = re.findall(r'(\d+[\d\.]*[KMkm]?)\s*(?:plays|views|view)', chunk, re.IGNORECASE)
            
            # Also check for numbers like >321K< or >2.4M< or "text":"2.4M"
            short_views = re.findall(r'>(\d+[\d\.]*[KMkm])<', chunk)
            json_views = re.findall(r'"text":\s*"(\d+[\d\.]*[KMkm]?)"', chunk)
            
            all_v = views + short_views + json_views
            # filter out css/time strings like 1m, 24px, etc.
            clean_v = [v for v in all_v if not v.endswith('px') and not v.endswith('s') and not v.endswith('%')]
            
            # Find image / thumbnail
            imgs = re.findall(r'src="([^"]+?\.(?:jpg|png|webp))"', chunk)
            clean_imgs = [i for i in imgs if not 'rsrc.php' in i and not 'emoji.php' in i and not '.svg' in i]
            
            # Find caption / description
            # Usually in aria-label="..."
            aria = re.findall(r'aria-label="([^"]{15,300})"', chunk)
            
            reel_data.append({
                'id': r_id,
                'views': clean_v[:3] if clean_v else ['N/A'],
                'aria': aria[:2] if aria else [],
                'img': clean_imgs[0] if clean_imgs else None
            })

    print(f"\nSample of extracted Reels (first 25):")
    for r in reel_data[:25]:
        print(f"  Reel {r['id']}: Views={r['views']} | Caption={r['aria'][:1]}")

    # Find highest view counts across all reels
    all_views_found = []
    for r in reel_data:
        for v in r['views']:
            if v != 'N/A':
                all_views_found.append((v, r['id']))
    
    print("\n--- VIEW COUNT OCCURRENCES ---")
    v_counts = {}
    for v, rid in all_views_found:
        v_counts[v] = v_counts.get(v, 0) + 1
    
    # Sort by likely view count
    for v, c in sorted(v_counts.items(), key=lambda x: x[1], reverse=True)[:30]:
        print(f"  {v}: seen {c} times")

analyze_reels_page('(1) Dear Ekra Reels _ Facebook.html')
analyze_reels_page('Facebook.html')

