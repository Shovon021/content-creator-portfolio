import re
import json

slug_map = {
    'proj-cozycafe': 'cozycafe',
    'proj-sultansdine': 'sultansdine',
    'proj-caketown': 'caketown',
    'proj-tehanitea': 'tehanitea',
    'proj-japanbazar': 'japanbazar',
    'proj-dralvin': 'dralvin',
    'proj-elhoe': 'elhoe',
    'proj-innsaei': 'innsaei',
    'proj-herstudio': 'herstudio',
    'proj-basecamp': 'basecamp',
    'proj-bandarban': 'bandarban',
    'proj-sylhet': 'sylhet',
    'proj-ayeshasgallery': 'ayeshasgallery',
    'proj-childrengoods': 'childrengoods',
    'proj-marshmallow': 'marshmallow',
    'proj-paimart': 'paimart',
    'proj-dentflix': 'dentflix',
    'proj-commutevlog': 'commutevlog',
    'proj-echoapp': 'echoapp'
}

with open('src/data/portfolioData.js', 'r', encoding='utf-8') as f:
    text = f.read()

for proj_id, slug in slug_map.items():
    preview_url = f"/previews/{slug}_preview.mp4"
    # Find the object block
    pattern = rf'(id:\s*["\']{proj_id}["\'].*?)(aspect:\s*["\'][^"\']+["\'])'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        block = match.group(1)
        aspect_line = match.group(2)
        
        # Check if fields already added
        if 'previewSrc' not in block:
            new_fields = (
                f'previewSrc: "{preview_url}",\n'
                f'    videoSrc: "/videos/{slug if slug != "cozycafe" and slug != "sultansdine" and slug != "caketown" and slug != "tehanitea" and slug != "japanbazar" and slug != "dralvin" and slug != "elhoe" and slug != "innsaei" and slug != "herstudio" and slug != "basecamp" and slug != "bandarban" and slug != "sylhet" and slug != "ayeshasgallery" and slug != "childrengoods" and slug != "marshmallow" and slug != "paimart" and slug != "commutevlog" and slug != "echoapp" else ""}",\n'
            )
            # Actually let's use the localVideoUrl that's already in the block
            # Let's extract localVideoUrl
            v_match = re.search(r'localVideoUrl:\s*["\']([^"\']+)["\']', block)
            v_src = v_match.group(1) if v_match else f"/videos/{slug}.mp4"
            
            enrichment = (
                f'previewSrc: "{preview_url}",\n'
                f'    videoSrc: "{v_src}",\n'
                f'    shareSlug: "{slug}",\n'
                f'    hasAudioTrack: true,\n'
                f'    duration: 30,\n'
                f'    segments: [\n'
                f'      {{ label: "Scene 1: Hook & Ambience", start: 0, duration: 1.3 }},\n'
                f'      {{ label: "Scene 2: Core Experience", start: 1.3, duration: 1.3 }},\n'
                f'      {{ label: "Scene 3: Details & Result", start: 2.6, duration: 1.3 }}\n'
                f'    ],\n'
                f'    {aspect_line}'
            )
            text = text.replace(match.group(0), f"{block}{enrichment}", 1)
            print(f"Enriched {proj_id}")
        else:
            print(f"{proj_id} already enriched")

with open('src/data/portfolioData.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Finished enriching src/data/portfolioData.js")

