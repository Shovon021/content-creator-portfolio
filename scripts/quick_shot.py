import subprocess
import time
import requests
import json
import base64
import os

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9255
TEMP_PROFILE = r"C:\temp\chrome_quick_shot"

# Make sure any old chrome is killed
subprocess.run(["taskkill", "/F", "/IM", "chrome.exe"], capture_output=True)
time.sleep(1)

cmd = [
    CHROME_PATH,
    "--headless=new",
    f"--remote-debugging-port={PORT}",
    "--disable-gpu",
    "--window-size=1440,900",
    "--no-first-run",
    "--no-default-browser-check",
    f"--user-data-dir={TEMP_PROFILE}",
    "http://localhost:5173"
]

print("Launching Chrome...", flush=True)
proc = subprocess.Popen(cmd)
time.sleep(3)

print("Connecting to Chrome CDP...", flush=True)
try:
    res = requests.get(f"http://127.0.0.1:{PORT}/json", timeout=5)
    targets = res.json()
    page_target = next(t for t in targets if t.get("type") == "page")
    ws_url = page_target["webSocketDebuggerUrl"]
    print("Found page target:", ws_url, flush=True)

    import websockets
    import asyncio

    async def capture():
        async with websockets.connect(ws_url) as ws:
            # Enable Page
            await ws.send(json.dumps({"id": 1, "method": "Page.enable"}))
            await ws.recv()
            
            # Wait for render
            await asyncio.sleep(2)
            
            # Capture screenshot
            await ws.send(json.dumps({"id": 2, "method": "Page.captureScreenshot", "params": {"format": "png"}}))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get("id") == 2:
                    data = resp["result"]["data"]
                    path = r"C:\Users\USER\.gemini\antigravity\brain\865c267e-f567-40a1-ab7e-de2fa02fce60\screenshot_header_verification.png"
                    with open(path, "wb") as f:
                        f.write(base64.b64decode(data))
                    print("Screenshot successfully saved to", path, flush=True)
                    break

    asyncio.run(capture())
finally:
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except Exception:
        proc.kill()
    print("Done!", flush=True)

