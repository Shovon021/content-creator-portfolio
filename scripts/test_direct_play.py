import asyncio
import json
import subprocess
import time
import requests
import websockets
import os
import shutil

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9226
TEMP_PROFILE = os.path.join(os.environ.get('TEMP', 'C:\\temp'), 'chrome_test_pwa2')

def start_chrome():
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--disable-gpu",
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

    async with websockets.connect(ws_url) as ws:
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

        print("Navigating to http://localhost:5173...")
        await call("Page.navigate", {"url": "http://localhost:5173"})
        await asyncio.sleep(3.5)

        # Test direct play on the video element
        test_direct_play = """
        (async () => {
            const video = document.querySelector('article video');
            if (!video) return { error: "No video found" };
            
            video.muted = true;
            try {
                await video.play();
                await new Promise(r => setTimeout(r, 1000));
                return {
                    success: true,
                    paused: video.paused,
                    currentTime: video.currentTime,
                    duration: video.duration
                };
            } catch (err) {
                return {
                    success: false,
                    errorName: err.name,
                    errorMessage: err.message
                };
            }
        })()
        """
        direct_res = await call("Runtime.evaluate", {"expression": test_direct_play, "awaitPromise": True, "returnByValue": True})
        print("Direct video.play() result:", json.dumps(direct_res.get("result", {}).get("value"), indent=2))

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

