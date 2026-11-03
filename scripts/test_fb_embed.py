import asyncio
import json
import subprocess
import time
import requests
import websockets
import os
import shutil
import base64

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9235
TEMP_PROFILE = os.path.join(os.environ.get('TEMP', 'C:\\temp'), 'chrome_test_fb_embed')

def start_chrome():
    if os.path.exists(TEMP_PROFILE):
        shutil.rmtree(TEMP_PROFILE, ignore_errors=True)
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--disable-gpu",
        "--window-size=400,700",
        "--no-first-run",
        "--no-default-browser-check",
        f"--user-data-dir={TEMP_PROFILE}",
        "about:blank"
    ]
    proc = subprocess.Popen(cmd)
    time.sleep(2.0)
    return proc

async def run_cdp():
    res = requests.get(f"http://127.0.0.1:{PORT}/json")
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
        
        embed_url = "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2018298545546153&show_text=false&autoplay=true"
        print("Navigating to:", embed_url)
        await call("Page.navigate", {"url": embed_url})
        await asyncio.sleep(4.0)

        shot = await call("Page.captureScreenshot", {"format": "png"})
        path = r"C:\Users\USER\.gemini\antigravity\brain\865c267e-f567-40a1-ab7e-de2fa02fce60\test_fb_embed_screenshot.png"
        with open(path, "wb") as f:
            f.write(base64.b64decode(shot["data"]))
        print("Screenshot saved to:", path)

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

if __name__ == "__main__":
    main()

