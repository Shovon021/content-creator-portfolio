import asyncio
import json
import subprocess
import time
import requests
import websockets
import os
import shutil

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9230
TEMP_PROFILE = os.path.join(os.environ.get('TEMP', 'C:\\temp'), 'chrome_test_sniff')

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

    mp4_urls_captured = []

    async with websockets.connect(ws_url, max_size=15 * 1024 * 1024) as ws:
        msg_id = 1
        async def call(method, params=None):
            nonlocal msg_id
            m = {"id": msg_id, "method": method, "params": params or {}}
            msg_id += 1
            await ws.send(json.dumps(m))
            while True:
                resp = json.loads(await ws.recv())
                # also listen for Network.requestWillBeSent
                if resp.get("method") == "Network.requestWillBeSent":
                    url = resp.get("params", {}).get("request", {}).get("url", "")
                    if ".mp4" in url or "bytestart" in url:
                        mp4_urls_captured.append(url)
                if resp.get("id") == m["id"]:
                    return resp.get("result", {})

        await call("Page.enable")
        await call("Network.enable")

        test_reel = "https://www.facebook.com/reel/2018298545546153"
        print(f"Navigating to {test_reel}...")
        await call("Page.navigate", {"url": test_reel})

        # Wait 8 seconds while Facebook loads and plays video
        start_t = time.time()
        while time.time() - start_t < 8.0:
            try:
                resp = json.loads(await asyncio.wait_for(ws.recv(), timeout=1.0))
                if resp.get("method") == "Network.requestWillBeSent":
                    url = resp.get("params", {}).get("request", {}).get("url", "")
                    if ".mp4" in url or "fbcdn.net/o1/v/" in url:
                        mp4_urls_captured.append(url)
            except asyncio.TimeoutError:
                pass

        print(f"Captured {len(mp4_urls_captured)} MP4/video network requests:")
        for u in mp4_urls_captured[:5]:
            print(u[:120])

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

