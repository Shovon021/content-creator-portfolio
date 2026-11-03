import subprocess
import os

os.makedirs('public/videos', exist_ok=True)

# 18 campaigns
campaigns = [
    ('cozy_cafe', 'public/thumbnails/cozy_cafe.jpg', 'pan_up'),
    ('sultans_dine', 'public/thumbnails/sultans_dine.jpg', 'pan_down'),
    ('cake_town', 'public/thumbnails/cake_town.jpg', 'zoom_in'),
    ('tehani_tea', 'public/thumbnails/tehani_tea.jpg', 'pan_right'),
    ('japan_bazar', 'public/thumbnails/japan_bazar.jpg', 'zoom_in'),
    ('dr_alvin', 'public/thumbnails/dr_alvin.jpg', 'pan_left'),
    ('elhoe', 'public/thumbnails/elhoe.jpg', 'zoom_out'),
    ('innsaei', 'public/thumbnails/innsaei.jpg', 'pan_up'),
    ('her_studio', 'public/thumbnails/her_studio.jpg', 'zoom_in'),
    ('basecamp', 'public/thumbnails/basecamp.jpg', 'pan_right'),
    ('bandarban', 'public/thumbnails/bandarban.jpg', 'pan_up'),
    ('sylhet_tour', 'public/thumbnails/sylhet_tour.jpg', 'pan_left'),
    ('ayeshas_gallery', 'public/thumbnails/ayeshas_gallery.jpg', 'zoom_in'),
    ('children_goods', 'public/thumbnails/children_goods.jpg', 'pan_down'),
    ('marshmallow_tech', 'public/thumbnails/marshmallow_tech.jpg', 'zoom_in'),
    ('paimart', 'public/thumbnails/paimart.jpg', 'pan_right'),
    ('campus_commute', 'public/thumbnails/campus_commute.jpg', 'pan_up'),
    ('echo_app', 'public/thumbnails/echo_app.jpg', 'zoom_in')
]

for name, thumb, motion_type in campaigns:
    if not os.path.exists(thumb):
        print(f"Skipping {name}: {thumb} not found")
        continue

    out_file = f"public/videos/{name}.mp4"
    
    # Determine zoompan filter based on motion type
    # Total duration = 4.5 seconds (112 frames @ 25fps)
    if motion_type == 'pan_up':
        # Starts zoomed 1.18x at bottom, pans smoothly up
        filter_str = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='1.18':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*(1-on/112)':d=112:s=720x1280:fps=25"
    elif motion_type == 'pan_down':
        # Starts zoomed 1.18x at top, pans smoothly down
        filter_str = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='1.18':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*(on/112)':d=112:s=720x1280:fps=25"
    elif motion_type == 'pan_right':
        # Starts on left, pans smoothly right
        filter_str = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='1.18':x='(iw-iw/zoom)*(on/112)':y='(ih-ih/zoom)/2':d=112:s=720x1280:fps=25"
    elif motion_type == 'pan_left':
        # Starts on right, pans smoothly left
        filter_str = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='1.18':x='(iw-iw/zoom)*(1-on/112)':y='(ih-ih/zoom)/2':d=112:s=720x1280:fps=25"
    elif motion_type == 'zoom_out':
        # Starts zoomed in 1.25x, glides back to 1.05x
        filter_str = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='1.25-0.20*(on/112)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=112:s=720x1280:fps=25"
    else: # zoom_in
        # Starts at 1.05x, glides smoothly in to 1.25x
        filter_str = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='1.05+0.20*(on/112)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=112:s=720x1280:fps=25"

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", thumb,
        "-vf", filter_str,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-tune", "fastdecode",
        "-pix_fmt", "yuv420p",
        "-t", "4.5",
        "-movflags", "+faststart",
        out_file
    ]

    res = subprocess.run(cmd, capture_output=True)
    if res.returncode == 0:
        print(f"[OK] {name:<18} ({motion_type}) -> {os.path.getsize(out_file)} bytes")
    else:
        print(f"[ERR] {name}: {res.stderr.decode('utf-8', errors='ignore')[:100]}")

print("All cinematic dynamic motion previews generated!")

