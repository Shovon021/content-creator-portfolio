import os
import re

# Let's inspect `(1) Dear Ekra Reels _ Facebook.html` to find all reel IDs and their corresponding image files saved by Chrome!
with open('(1) Dear Ekra Reels _ Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Pattern: <a ... href="https://www.facebook.com/reel/(\d+)..." ... <img ... src="./(1) Dear Ekra Reels _ Facebook_files/([^"]+)"
matches = re.findall(r'href="https://www\.facebook\.com/reel/(\d+)[^"]*".*?src="\./\([^"]+?\)_files/([^"]+)"', html, re.DOTALL)
print(f"Matched {len(matches)} reel -> img pairs in Reels HTML")

# Also let's inspect `Facebook.html` for local images
with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    fb_html = f.read()

# Let's see what images are saved in Facebook_files
fb_files = os.listdir('Facebook_files') if os.path.exists('Facebook_files') else []
reels_files = os.listdir('(1) Dear Ekra Reels _ Facebook_files') if os.path.exists('(1) Dear Ekra Reels _ Facebook_files') else []

print(f"Facebook_files count: {len(fb_files)}")
print(f"Reels_files count: {len(reels_files)}")

# Filter jpg/png files > 10KB in both
large_reels_imgs = [f for f in reels_files if f.endswith(('.jpg', '.png', '.webp')) and os.path.getsize(os.path.join('(1) Dear Ekra Reels _ Facebook_files', f)) > 15000]
large_fb_imgs = [f for f in fb_files if f.endswith(('.jpg', '.png', '.webp')) and os.path.getsize(os.path.join('Facebook_files', f)) > 15000]

print(f"Large reels images: {len(large_reels_imgs)}")
print(f"Large FB images: {len(large_fb_imgs)}")

