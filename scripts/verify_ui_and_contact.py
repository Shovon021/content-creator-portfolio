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
PORT = 9231
TEMP_PROFILE = os.path.join(os.environ.get('TEMP', 'C:\\temp'), 'chrome_test_ui_verify')

def start_chrome():
    if os.path.exists(TEMP_PROFILE):
        try:
            shutil.rmtree(TEMP_PROFILE, ignore_errors=True)
        except Exception:
            pass
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

        print("Navigating to http://localhost:5173...")
        await call("Page.navigate", {"url": "http://localhost:5173"})
        await asyncio.sleep(3.0)

        # 1. Header Verification
        header_check = await call("Runtime.evaluate", {
            "expression": """
            (() => {
                const header = document.querySelector('header');
                const brand = header ? header.innerText : '';
                const style = header ? window.getComputedStyle(header) : null;
                const contactBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Contact'));
                return {
                    foundHeader: Boolean(header),
                    headerBg: style ? style.backgroundColor : '',
                    hasBrand: brand.includes('Dear Ekra'),
                    hasDhaka: brand.includes('Dhaka'),
                    hasContactBtn: Boolean(contactBtn),
                    contactBtnText: contactBtn ? contactBtn.innerText : ''
                };
            })()
            """,
            "returnByValue": True
        })
        print("Header Check Result:", json.dumps(header_check.get("result", {}).get("value"), indent=2))

        # Screenshot 1: Header & Hero
        shot1 = await call("Page.captureScreenshot", {"format": "png"})
        path1 = r"C:\Users\USER\.gemini\antigravity\brain\865c267e-f567-40a1-ab7e-de2fa02fce60\screenshot_header_verification.png"
        with open(path1, "wb") as f:
            f.write(base64.b64decode(shot1["data"]))
        print("Saved screenshot 1 to:", path1)

        # 2. Click Contact Button to open Contact Modal
        click_res = await call("Runtime.evaluate", {
            "expression": """
            (() => {
                const contactBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Contact'));
                if (contactBtn) {
                    contactBtn.click();
                    return true;
                }
                return false;
            })()
            """,
            "returnByValue": True
        })
        print("Clicked Contact Button:", click_res.get("result", {}).get("value"))
        await asyncio.sleep(1.0)

        # Verify modal content
        modal_check = await call("Runtime.evaluate", {
            "expression": """
            (() => {
                const title = document.querySelector('h3');
                const whatsapp = document.querySelector('a[href*="wa.me"]');
                const messenger = document.querySelector('a[href*="m.me"]');
                const phone = document.querySelector('a[href*="tel:"]');
                const collabBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Open Collab Form'));
                return {
                    modalTitle: title ? title.innerText : '',
                    hasWhatsApp: Boolean(whatsapp),
                    whatsAppBadge: whatsapp ? whatsapp.innerText : '',
                    hasMessenger: Boolean(messenger),
                    messengerBadge: messenger ? messenger.innerText : '',
                    hasPhone: Boolean(phone),
                    phoneBadge: phone ? phone.innerText : '',
                    hasCollabBtn: Boolean(collabBtn)
                };
            })()
            """,
            "returnByValue": True
        })
        print("Modal Check Result:", json.dumps(modal_check.get("result", {}).get("value"), indent=2))

        # Screenshot 2: Open Contact Modal
        shot2 = await call("Page.captureScreenshot", {"format": "png"})
        path2 = r"C:\Users\USER\.gemini\antigravity\brain\865c267e-f567-40a1-ab7e-de2fa02fce60\screenshot_contact_modal_verification.png"
        with open(path2, "wb") as f:
            f.write(base64.b64decode(shot2["data"]))
        print("Saved screenshot 2 to:", path2)

        # Close Modal
        await call("Runtime.evaluate", {
            "expression": """
            (() => {
                const closeBtn = document.querySelector('button[aria-label="Close dialog"]');
                if (closeBtn) closeBtn.click();
            })()
            """
        })
        await asyncio.sleep(0.5)

        # 3. Test Video Card in Gallery
        scroll_card = await call("Runtime.evaluate", {
            "expression": """
            (() => {
                const player = document.querySelector('[data-testid^="reel-card-"]');
                if (!player) return null;
                player.scrollIntoView({ behavior: 'instant', block: 'center' });
                const rect = player.getBoundingClientRect();
                return {
                    id: player.getAttribute('data-testid'),
                    state: player.getAttribute('data-state'),
                    x: Math.round(rect.x + rect.width / 2),
                    y: Math.round(rect.y + rect.height / 2)
                };
            })()
            """,
            "returnByValue": True
        })
        card_info = scroll_card.get("result", {}).get("value")
        print("Card Info before hover/click:", card_info)

        if card_info:
            cx, cy = card_info["x"], card_info["y"]
            # Hover over card
            await call("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": cx, "y": cy})
            await asyncio.sleep(0.7)

            hover_state = await call("Runtime.evaluate", {
                "expression": """
                (() => {
                    const player = document.querySelector('[data-testid^="reel-card-"]');
                    return {
                        state: player ? player.getAttribute('data-state') : null,
                        videoSrc: player && player.querySelector('video') ? player.querySelector('video').src : null
                    };
                })()
                """,
                "returnByValue": True
            })
            print("Card Info during hover:", hover_state.get("result", {}).get("value"))

            # Click card to trigger inline 0:00 playback with sound
            click_res = await call("Runtime.evaluate", {
                "expression": """
                (() => {
                    const player = document.querySelector('[data-testid^="reel-card-"]');
                    if (player) {
                        player.click();
                        return true;
                    }
                    return false;
                })()
                """,
                "returnByValue": True
            })
            print("Clicked video card directly:", click_res.get("result", {}).get("value"))
            await asyncio.sleep(2.5)

            click_state = await call("Runtime.evaluate", {
                "expression": """
                (() => {
                    const player = document.querySelector('[data-testid^="reel-card-"]');
                    const iframe = player ? player.querySelector('iframe') : null;
                    const vid = player ? player.querySelector('video') : null;
                    return {
                        state: player ? player.getAttribute('data-state') : null,
                        hasIframe: Boolean(iframe),
                        iframeSrc: iframe ? iframe.src : null,
                        videoSrc: vid ? vid.src : null
                    };
                })()
                """,
                "returnByValue": True
            })
            print("Card Info after click (playing):", click_state.get("result", {}).get("value"))

            # Screenshot 3: Video playing inline
            shot3 = await call("Page.captureScreenshot", {"format": "png"})
            path3 = r"C:\Users\USER\.gemini\antigravity\brain\865c267e-f567-40a1-ab7e-de2fa02fce60\screenshot_video_playing.png"
            with open(path3, "wb") as f:
                f.write(base64.b64decode(shot3["data"]))
            print("Saved screenshot 3 to:", path3)

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
