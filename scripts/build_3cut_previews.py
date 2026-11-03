import os
import subprocess
import json

os.makedirs('public/previews', exist_ok=True)

campaigns = [
    ('cozycafe', 'public/thumbnails/cozy_cafe.jpg'),
    ('sultansdine', 'public/thumbnails/sultans_dine.jpg'),
    ('caketown', 'public/thumbnails/cake_town.jpg'),
    ('tehanitea', 'public/thumbnails/tehani_tea.jpg'),
    ('japanbazar', 'public/thumbnails/japan_bazar.jpg'),
    ('dralvin', 'public/thumbnails/dr_alvin.jpg'),
    ('elhoe', 'public/thumbnails/elhoe.jpg'),
    ('innsaei', 'public/thumbnails/innsaei.jpg'),
    ('herstudio', 'public/thumbnails/her_studio.jpg'),
    ('basecamp', 'public/thumbnails/basecamp.jpg'),
    ('bandarban', 'public/thumbnails/bandarban.jpg'),
    ('sylhet', 'public/thumbnails/sylhet_tour.jpg'),
    ('ayeshasgallery', 'public/thumbnails/ayeshas_gallery.jpg'),
    ('childrengoods', 'public/thumbnails/children_goods.jpg'),
    ('marshmallow', 'public/thumbnails/marshmallow_tech.jpg'),
    ('paimart', 'public/thumbnails/paimart.jpg'),
    ('dentflix', 'public/thumbnails/dentflix.jpg'),
    ('commutevlog', 'public/thumbnails/campus_commute.jpg'),
    ('echoapp', 'public/thumbnails/echo_app.jpg')
]

for slug, thumb in campaigns:
    out_preview = f"public/previews/{slug}_preview.mp4"
    
    if slug == 'dentflix' and os.path.exists('public/videos/real_reel_clip.mp4'):
        # For Dentflix, use 3 cuts from the real video
        filter_str = (
            "[0:v]trim=start=0.5:duration=1.3,setpts=PTS-STARTPTS,scale=480:600:force_original_aspect_ratio=increase,crop=480:600[v0]; "
            "[0:v]trim=start=2.5:duration=1.3,setpts=PTS-STARTPTS,scale=480:600:force_original_aspect_ratio=increase,crop=480:600[v1]; "
            "[0:v]trim=start=5.0:duration=1.3,setpts=PTS-STARTPTS,scale=480:600:force_original_aspect_ratio=increase,crop=480:600[v2]; "
            "[v0][v1][v2]concat=n=3:v=1:a=0[outv]"
        )
        cmd = [
            "ffmpeg", "-y",
            "-i", "public/videos/real_reel_clip.mp4",
            "-filter_complex", filter_str,
            "-map", "[outv]",
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "26",
            "-g", "24", "-keyint_min", "24",
            "-pix_fmt", "yuv420p",
            "-an",
            "-movflags", "+faststart",
            out_preview
        ]
    else:
        if not os.path.exists(thumb):
            print(f"Skipping {slug}: {thumb} not found")
            continue
        
        # 3 distinct cuts from the photo:
        # Cut 1: Wide establishing pan up
        # Cut 2: Center close-up zoom in (1.25x)
        # Cut 3: Dynamic horizontal pan right
        filter_str = (
            "[0:v]scale=960:1200:force_original_aspect_ratio=increase,crop=960:1200,zoompan=z='1.15':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*(1-on/32)':d=32:s=480x600:fps=25[v0]; "
            "[0:v]scale=960:1200:force_original_aspect_ratio=increase,crop=960:1200,zoompan=z='1.10+0.25*(on/32)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=32:s=480x600:fps=25[v1]; "
            "[0:v]scale=960:1200:force_original_aspect_ratio=increase,crop=960:1200,zoompan=z='1.20':x='(iw-iw/zoom)*(on/32)':y='(ih-ih/zoom)/2':d=32:s=480x600:fps=25[v2]; "
            "[v0][v1][v2]concat=n=3:v=1:a=0[outv]"
        )
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", thumb,
            "-filter_complex", filter_str,
            "-map", "[outv]",
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "26",
            "-g", "24", "-keyint_min", "24",
            "-pix_fmt", "yuv420p",
            "-an",
            "-t", "3.9",
            "-movflags", "+faststart",
            out_preview
        ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"[OK] Generated {out_preview} ({os.path.getsize(out_preview)} bytes)")
    else:
        print(f"[ERR] {slug}: {res.stderr[:120]}")

print("All 3-cut multi-scene previews completed!")
