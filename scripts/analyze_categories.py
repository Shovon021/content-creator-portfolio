import re
import json
from collections import Counter

with open('(1) Dear Ekra Reels _ Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# 1. Extract all hashtags (#...)
hashtags = re.findall(r'#([A-Za-z0-9_\u0980-\u09FF]+)', text)
tag_counts = Counter([t.lower() for t in hashtags])

print(f"Total hashtags found: {len(hashtags)}")
print("Top 40 most frequent hashtags:")
for tag, count in tag_counts.most_common(40):
    print(f"  #{tag}: {count}")

# 2. Extract captions / aria-labels / text snippets
# Search for patterns where reels are described
captions = re.findall(r'aria-label="([^"]{10,250})"', text)
clean_caps = [c for c in captions if not 'seen' in c and not 'Close' in c and not 'like' in c.lower()]

# Categorize based on keywords in captions, hashtags, and text
categories = {
    "Food, Cafes & Fine Dining": [
        "food", "cafe", "coffee", "restaurant", "burger", "biryani", "dine", "sultan",
        "eat", "pasta", "bakery", "cake", "sweet", "dessert", "foodie", "kacchi", "platter"
    ],
    "Fashion, Sarees & Traditional Wear": [
        "saree", "dress", "fashion", "styling", "outfit", "traditional", "eid", "festive",
        "collection", "kurti", "jewellery", "clothing", "wear", "elegance", "wedding"
    ],
    "Beauty, Skincare & Cosmetics PR": [
        "skin", "skincare", "beauty", "cosmetics", "makeup", "japan bazar", "cream",
        "serum", "acne", "salon", "spa", "hair", "haircare", "glow", "parlor"
    ],
    "Travel, Resorts & Outdoor Adventures": [
        "travel", "resort", "tour", "tourist", "bandarban", "cox", "sajek", "adventure",
        "basecamp", "nature", "trip", "vacation", "hill", "getaway", "camping"
    ],
    "Tech, Gadgets & Store Grand Openings": [
        "tech", "gadget", "store", "shop", "opening", "launch", "anime", "marshmallow",
        "discount", "offer", "paimart", "superstore", "shopping", "device"
    ],
    "Healthcare, Wellness & Dental Care": [
        "dental", "dentflix", "dentist", "teeth", "care", "health", "clinic", "doctor"
    ],
    "Lifestyle, Campus Adda & Personal Storytelling": [
        "lifestyle", "vlog", "daily", "reels", "bangladesh", "dhaka", "campus", "ewu",
        "friends", "adda", "university", "student", "story", "life"
    ]
}

category_counts = {cat: 0 for cat in categories}
categorized_samples = {cat: [] for cat in categories}

# Search entire document for category keyword frequency
for cat, kws in categories.items():
    for kw in kws:
        matches = len(re.findall(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE))
        category_counts[cat] += matches

print("\n--- CATEGORY MATCH FREQUENCY ---")
for cat, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  * {cat}: {count} keyword signals")

with open('scripts/extracted_categories.json', 'w', encoding='utf-8') as out:
    json.dump({
        'top_hashtags': tag_counts.most_common(50),
        'category_keyword_matches': category_counts
    }, out, indent=2)

print("\nWrote scripts/extracted_categories.json")

