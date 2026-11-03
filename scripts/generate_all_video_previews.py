import os
import subprocess

os.makedirs('public/videos', exist_ok=True)

thumbnails = {
    'cozy_cafe': 'public/thumbnails/cozy_cafe.jpg',
    'sultans_dine': 'public/thumbnails/sultans_dine.jpg',
    'cake_town': 'public/thumbnails/cake_town.jpg',
    'tehani_tea': 'public/thumbnails/tehani_tea.jpg',
    'japan_bazar': 'public/thumbnails/japan_bazar.jpg',
    'dr_alvin': 'public/thumbnails/dr_alvin.jpg',
    'elhoe': 'public/thumbnails/elhoe.jpg',
    'innsaei': 'public/thumbnails/innsaei.jpg',
    'her_studio': 'public/thumbnails/her_studio.jpg',
    'basecamp': 'public/thumbnails/basecamp.jpg',
    'bandarban': 'public/thumbnails/bandarban.jpg',
    'sylhet_tour': 'public/thumbnails/sylhet_tour.jpg',
    'ayeshas_gallery': 'public/thumbnails/ayeshas_gallery.jpg',
    'children_goods': 'public/thumbnails/children_goods.jpg',
    'marshmallow_tech': 'public/thumbnails/marshmallow_tech.jpg',
    'paimart': 'public/thumbnails/paimart.jpg',
    'campus_commute': 'public/thumbnails/campus_commute.jpg',
    'echo_app': 'public/thumbnails/echo_app.jpg'
}

for name, thumb_path in thumbnails.items():
    out_mp4 = f"public/videos/{name}.mp4"
    if not os.path.exists(thumb_path):
        print(f"Skipping {name}: thumbnail {thumb_path} not found")
        continue

    # Use ffmpeg zoompan with smooth cinematic glide
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", thumb_path,
        "-vf", "scale=540:960,zoompan=z='min(zoom+0.0018,1.18)':d=80:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=540x960",
        "-c:v", "libx264",
        "-t", "3.2",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        out_mp4
    ]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode == 0:
        print(f"[OK] Generated {out_mp4} ({os.path.getsize(out_mp4)} bytes)")
    else:
        print(f"[ERROR] Failed {name}: {res.stderr.decode('utf-8', errors='ignore')[:150]}")

print("\nDone generating all video previews!")

