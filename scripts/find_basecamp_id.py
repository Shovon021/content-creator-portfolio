import re

with open('Facebook.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

pos = 6158908
chunk = html[pos-3000:pos+4000]

print("Air Force Basecamp 15-16 digit IDs:", re.findall(r'\b\d{15,16}\b', chunk))

