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
PORT = 9229
TEMP_PROFILE = os.path.join(os.environ.get('TEMP', 'C:\\temp'), 'chrome_test_pwa5')

def start_chrome():
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--disable-gpu",
        "--window-size=1280,1024",
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
        await call("Runtime.enable")
        await call("DOM.enable")

        await call("Page.navigate", {"url": "http://localhost:5173"})
        await asyncio.sleep(3.5)

        # Scroll first gallery card into view
        scroll_res = await call("Runtime.evaluate", {
            "expression": """
            (() => {
                const card = document.querySelector('article');
                if (!card) return null;
                card.scrollIntoView({ behavior: 'instant', block: 'center' });
                const rect = card.getBoundingClientRect();
                return {
                    x: Math.round(rect.x + rect.width / 2),
                    y: Math.round(rect.y + rect.height / 2)
                };
            })()
            """,
            "returnByValue": True
        })
        coords = scroll_res.get("result", {}).get("value")

        # Take screenshot BEFORE hover
        shot_before = await call("Page.captureScreenshot", {"format": "png"})
        with open("C:/Users/USER/.gemini/antigravity/brain/865c267e-f567-40a1-ab7e-de2fa02fce60/screenshot_before_hover.png", "wb") as f:
            f.write(base64.b64decode(shot_before["data"]))

        # Move mouse into card
        await call("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": 10, "y": 10})
        await asyncio.sleep(0.1)
        await call("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": coords["x"], "y": coords["y"]})

        # Wait 1.5 seconds during playback
        await asyncio.sleep(1.5)

        # Take screenshot DURING hover
        shot_during = await call("Page.captureScreenshot", {"format": "png"})
        with open("C:/Users/USER/.gemini/antigravity/brain/865c267e-f567-40a1-ab7e-de2fa02fce60/screenshot_during_hover.png", "wb") as f:
            f.write(base64.b64decode(shot_during["data"]))
        
        print("Screenshots saved!")

if __name__ == "__main__":
    proc = start_chrome()
    try:
        asyncio.run(run_cdp())
    finally:
        proc.terminate()
        try:
            shutil.rmtree(TEMP_PROFILE)
        except:
            pass
