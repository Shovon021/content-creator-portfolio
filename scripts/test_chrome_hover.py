import asyncio
import json
import subprocess
import time
import requests
import websockets
import os
import shutil

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9225
TEMP_PROFILE = os.path.join(os.environ.get('TEMP', 'C:\\temp'), 'chrome_test_pwa')

if os.path.exists(TEMP_PROFILE):
    try:
        shutil.rmtree(TEMP_PROFILE)
    except:
        pass

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

        # Check gallery cards
        check_js = """
        (() => {
            const articles = document.querySelectorAll('article');
            const videos = document.querySelectorAll('video');
            return {
                articlesFound: articles.length,
                videosFound: videos.length,
                firstArticleVideoSrc: articles[0] ? (articles[0].querySelector('video') ? articles[0].querySelector('video').src : 'NO_VIDEO_IN_FIRST_ARTICLE') : 'NO_ARTICLE'
            };
        })()
        """
        initial_check = await call("Runtime.evaluate", {"expression": check_js, "returnByValue": True})
        print("Initial Check:", json.dumps(initial_check.get("result", {}).get("value"), indent=2))

        # Now trigger mouseenter and check playback
        hover_js = """
        (async () => {
            const card = document.querySelector('article');
            if (!card) return { error: "No card found" };
            
            // Dispatch mouseenter on the card
            card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            
            // Wait 1.5 seconds
            await new Promise(r => setTimeout(r, 1500));
            
            const video = card.querySelector('video');
            if (!video) return { error: "No video found in card" };
            
            return {
                src: video.src,
                paused: video.paused,
                currentTime: video.currentTime,
                duration: video.duration,
                muted: video.muted,
                readyState: video.readyState,
                error: video.error ? { code: video.error.code, message: video.error.message } : null,
                opacity: window.getComputedStyle(video).opacity,
                display: window.getComputedStyle(video).display,
                visibility: window.getComputedStyle(video).visibility
            };
        })()
        """
        hover_test = await call("Runtime.evaluate", {"expression": hover_js, "awaitPromise": True, "returnByValue": True})
        print("Hover Playback Test:", json.dumps(hover_test.get("result", {}).get("value"), indent=2))

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

