import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
screenshot_path = r"C:\Users\USER\.gemini\antigravity\brain\865c267e-f567-40a1-ab7e-de2fa02fce60\site_arch_hero_preview.png"
url = "http://localhost:5173"

cmd = [
    chrome_path,
    "--headless=new",
    f"--screenshot={screenshot_path}",
    "--window-size=1280,2200",
    "--virtual-time-budget=4000",
    url
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
print("Saved:", os.path.exists(screenshot_path))
