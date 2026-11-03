import re

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

matches = re.findall(r'"profile_field_type":"([^"]+)"[^}]*"text":"([^"]+)"', text)
print("Profile fields found in Facebook.html:")
for field, val in set(matches):
    print(f"  * {field}: {val}")

# Also check for bio / intro text
bio = re.findall(r'"profile_intro_card"[^}]*"text":\s*"([^"]+)"', text)
print("\nProfile intro text:", bio)

# Also check for website, social links
socials = re.findall(r'https?://(?:www\.)?(?:instagram|youtube|tiktok|linkedin|facebook)\.com/[^\s"\'\<\>]+', text)
print("\nSocial links found:")
for s in set(socials):
    if not 'rsrc.php' in s and not 'fbcdn' in s:
        print("  *", s)

