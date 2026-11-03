import subprocess
import os

# Test dynamic motion generation on cozy_cafe
out_test = "public/videos/test_dynamic_cozy.mp4"
cmd = [
    "ffmpeg", "-y",
    "-loop", "1",
    "-i", "public/thumbnails/cozy_cafe.jpg",
    "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='1.0+0.18*sin(on/20)':x='(iw-iw/zoom)*(0.5+0.45*sin(on/25))':y='(ih-ih/zoom)*(0.5+0.45*cos(on/30))':d=125:s=720x1280:fps=25",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-tune", "fastdecode",
    "-pix_fmt", "yuv420p",
    "-t", "5",
    "-movflags", "+faststart",
    out_test
]
res = subprocess.run(cmd, capture_output=True, text=True)
print("Returncode:", res.returncode)
if res.returncode == 0:
    print("Generated dynamic video successfully! Size:", os.path.getsize(out_test))
else:
    print("Error:", res.stderr[:300])

