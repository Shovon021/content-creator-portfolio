import asyncio
import json
import subprocess
import time
import requests
import websockets
import os
import shutil
import base64
import random

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = random.randint(9300, 9500)
TEMP_PROFILE = os.path.join(os.environ.get('TEMP', 'C:\\temp'), f'chrome_test_header_{PORT}')

def start_chrome():
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--disable-gpu",
        "--window-size=1400,900",
        "--no-first-run",
        "--no-default-browser-check",
        f"--user-data-dir={TEMP_PROFILE}",
        "about:blank"
    ]
    proc = subprocess.Popen(cmd)
    time.sleep(2.0)
    return proc

async def run_cdp():
    res = requests.get(f"http://127.0.0.1:{PORT}/json", timeout=5)
    targets = res.json()
    page_target = next(t for t in targets if t.get("type") == "page")
    ws_url = page_target["webSocketDebuggerUrl"]

    async with websockets.connect(ws_url, max_size=15 * 1024 * 1024) as ws:
        msg_id = 1
        async def call(method, params=None):
            nonlocal msg_id
            m = {"id": msg_id, "method": method, "params": params or {}}
            msg_id += 1
            await ws.send(json.dumps(m))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get("id") == m["id"]:
                    return resp.get("result", {})

        await call("Page.enable")
        await call("Page.navigate", {"url": "http://localhost:5173"})
        await asyncio.sleep(2.5)

        # Capture header screenshot
        shot = await call("Page.captureScreenshot", {"format": "png", "clip": {"x": 0, "y": 0, "width": 1400, "height": 180, "scale": 1}})
        path = r"C:\Users\USER\.gemini\antigravity\brain\865c267e-f567-40a1-ab7e-de2fa02fce60\screenshot_header_verification.png"
        with open(path, "wb") as f:
            f.write(base64.b64decode(shot["data"]))
        print("Header screenshot saved to:", path)

def main():
    proc = start_chrome()
    try:
        asyncio.run(run_cdp())
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except Exception:
            proc.kill()
        if os.path.exists(TEMP_PROFILE):
            shutil.rmtree(TEMP_PROFILE, ignore_errors=True)

if __name__ == "__main__":
    main()

