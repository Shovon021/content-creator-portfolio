import subprocess
import time
import requests
import json
import base64
import os
import random

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = random.randint(9510, 9690)
TEMP_PROFILE = os.path.join(r"C:\temp", f"chrome_mobile_{PORT}")

cmd = [
    CHROME_PATH,
    "--headless=new",
    f"--remote-debugging-port={PORT}",
    "--disable-gpu",
    "--window-size=390,844",
    "--no-first-run",
    "--no-default-browser-check",
    f"--user-data-dir={TEMP_PROFILE}",
    "http://localhost:5173"
]

proc = subprocess.Popen(cmd)
time.sleep(2.5)

try:
    res = requests.get(f"http://127.0.0.1:{PORT}/json", timeout=5)
    targets = res.json()
    page_target = next(t for t in targets if t.get("type") == "page")
    ws_url = page_target["webSocketDebuggerUrl"]

    import websockets
    import asyncio

    async def capture():
        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({"id": 1, "method": "Page.enable"}))
            await ws.recv()
            await asyncio.sleep(2.0)
            
            # Capture mobile screenshot
            await ws.send(json.dumps({"id": 2, "method": "Page.captureScreenshot", "params": {"format": "png"}}))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get("id") == 2:
                    data = resp["result"]["data"]
                    path = r"C:\Users\USER\.gemini\antigravity\brain\865c267e-f567-40a1-ab7e-de2fa02fce60\screenshot_mobile_hero_view.png"
                    with open(path, "wb") as f:
                        f.write(base64.b64decode(data))
                    print("Saved mobile screenshot to:", path, flush=True)
                    break

    asyncio.run(capture())
finally:
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except Exception:
        proc.kill()

