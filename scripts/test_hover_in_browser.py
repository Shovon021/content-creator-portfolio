import asyncio
import json
import subprocess
import time
import requests
import websockets
import os

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9222

def start_chrome():
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--user-data-dir=" + os.path.abspath("temp_chrome_profile"),
        "about:blank"
    ]
    proc = subprocess.Popen(cmd)
    time.sleep(1.5)
    return proc

async def run_cdp():
    # 1. Get targets
    res = requests.get(f"http://127.0.0.1:{PORT}/json")
    targets = res.json()
    page_target = next(t for t in targets if t.get("type") == "page")
    ws_url = page_target["webSocketDebuggerUrl"]
    print(f"Connecting to CDP: {ws_url}")

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

        # Enable Page and Runtime
        await call("Page.enable")
        await call("Runtime.enable")

        # Navigate to http://localhost:5173
        print("Navigating to http://localhost:5173...")
        await call("Page.navigate", {"url": "http://localhost:5173"})
        await asyncio.sleep(3.0)

        # Evaluate what's on page
        eval_res = await call("Runtime.evaluate", {
            "expression": """
                (() => {
                    const articles = Array.from(document.querySelectorAll('article'));
                    const videos = Array.from(document.querySelectorAll('video'));
                    return {
                        articleCount: articles.length,
                        videoCount: videos.length,
                        videoSources: videos.map(v => ({ src: v.src, paused: v.paused, readyState: v.readyState, error: v.error ? v.error.message : null, currentSrc: v.currentSrc }))
                    };
                })()
            """,
            "returnByValue": True
        })
        print("Initial Page State:", json.dumps(eval_res.get("result", {}).get("value"), indent=2))

        # Now simulate mouse hover over the first article
        print("\n--- Simulating hover over first article ---")
        hover_res = await call("Runtime.evaluate", {
            "expression": """
                (async () => {
                    const firstCard = document.querySelector('article');
                    if (!firstCard) return { error: "No article card found" };

                    // Dispatch mouseenter on the card
                    firstCard.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                    
                    // Wait 1.5 seconds for video playback to kick in
                    await new Promise(r => setTimeout(r, 1500));
                    
                    const video = firstCard.querySelector('video');
                    return {
                        cardFound: true,
                        videoExists: Boolean(video),
                        videoSrc: video ? video.src : null,
                        videoPaused: video ? video.paused : null,
                        videoCurrentTime: video ? video.currentTime : null,
                        videoReadyState: video ? video.readyState : null,
                        videoError: video && video.error ? video.error.code : null,
                        videoMuted: video ? video.muted : null,
                        videoOpacity: video ? window.getComputedStyle(video).opacity : null,
                        videoZIndex: video ? window.getComputedStyle(video).zIndex : null
                    };
                })()
            """,
            "awaitPromise": True,
            "returnByValue": True
        })
        print("Hover Test Result:", json.dumps(hover_res.get("result", {}).get("value"), indent=2))

        # Check console errors
        console_res = await call("Runtime.evaluate", {
            "expression": "window.__errors || []",
            "returnByValue": True
        })
        print("Console errors:", console_res.get("result", {}).get("value"))

if __name__ == "__main__":
    proc = start_chrome()
    try:
        asyncio.run(run_cdp())
    finally:
        proc.terminate()

