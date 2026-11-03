import re

mapping = {
    'proj-cozycafe': '/videos/cozy_cafe.mp4',
    'proj-sultansdine': '/videos/sultans_dine.mp4',
    'proj-caketown': '/videos/cake_town.mp4',
    'proj-tehanitea': '/videos/tehani_tea.mp4',
    'proj-japanbazar': '/videos/japan_bazar.mp4',
    'proj-dralvin': '/videos/dr_alvin.mp4',
    'proj-elhoe': '/videos/elhoe.mp4',
    'proj-innsaei': '/videos/innsaei.mp4',
    'proj-herstudio': '/videos/her_studio.mp4',
    'proj-basecamp': '/videos/basecamp.mp4',
    'proj-bandarban': '/videos/bandarban.mp4',
    'proj-sylhet': '/videos/sylhet_tour.mp4',
    'proj-ayeshasgallery': '/videos/ayeshas_gallery.mp4',
    'proj-childrengoods': '/videos/children_goods.mp4',
    'proj-marshmallow': '/videos/marshmallow_tech.mp4',
    'proj-paimart': '/videos/paimart.mp4',
    'proj-dentflix': '/videos/dentflix_sample.mp4',
    'proj-commutevlog': '/videos/campus_commute.mp4',
    'proj-echoapp': '/videos/echo_app.mp4'
}

with open('src/data/portfolioData.js', 'r', encoding='utf-8') as f:
    text = f.read()

for proj_id, video_path in mapping.items():
    # Check if localVideoUrl is already there for this project
    # We find the object block for proj_id
    pattern = rf'(id:\s*["\']{proj_id}["\'].*?)(videoUrl:\s*["\'][^"\']+["\'],)'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        block_before = match.group(1)
        video_url_line = match.group(2)
        if 'localVideoUrl' not in block_before and f'localVideoUrl: "{video_path}"' not in text:
            replacement = f'{block_before}{video_url_line}\n    localVideoUrl: "{video_path}",'
            text = text.replace(match.group(0), replacement, 1)
            print(f'Updated {proj_id} with {video_path}')
        else:
            print(f'{proj_id} already has localVideoUrl')
    else:
        print(f'Could not match block for {proj_id}')

with open('src/data/portfolioData.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done updating src/data/portfolioData.js')

