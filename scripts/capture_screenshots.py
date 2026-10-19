"""
Automated screenshot generator using Chrome DevTools Protocol (CDP) and websockets.
Captures real browser screenshots of the live JalSuraksha application in light and dark themes.
"""

import asyncio
import base64
import json
import os
import subprocess
import time
import requests
import websockets

SCREENSHOT_DIR = os.path.abspath(r"docs\screenshots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CDP_PORT = 9222


class ChromeCDPClient:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.msg_id = 0
        self.ws = None

    async def connect(self):
        self.ws = await websockets.connect(self.ws_url, max_size=50 * 1024 * 1024)

    async def send_cmd(self, method, params=None):
        self.msg_id += 1
        cid = self.msg_id
        payload = {"id": cid, "method": method, "params": params or {}}
        await self.ws.send(json.dumps(payload))
        while True:
            resp = json.loads(await self.ws.recv())
            if resp.get("id") == cid:
                return resp.get("result", {})

    async def evaluate(self, expression):
        res = await self.send_cmd("Runtime.evaluate", {
            "expression": expression,
            "awaitPromise": True,
            "returnByValue": True
        })
        return res.get("result", {}).get("value")

    async def capture_screenshot(self, filepath):
        res = await self.send_cmd("Page.captureScreenshot", {"format": "png"})
        data = base64.b64decode(res["data"])
        with open(filepath, "wb") as f:
            f.write(data)
        print(f"Captured: {filepath} ({len(data):,} bytes)")

    async def close(self):
        if self.ws:
            await self.ws.close()


async def run_capture():
    # 1. Desktop session (1440x960)
    proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=1440,960",
        "http://localhost:3000/?year=2026&state=UP&region=agra&mode=water"
    ])

    time.sleep(3)

    try:
        r = requests.get(f"http://127.0.0.1:{CDP_PORT}/json")
        tabs = [t for t in r.json() if "localhost:3000" in t.get("url", "")]
        if not tabs:
            tabs = [t for t in r.json() if t.get("type") == "page"]
        
        target_tab = tabs[0]
        client = ChromeCDPClient(target_tab["webSocketDebuggerUrl"])
        await client.connect()

        # Wait for page readiness
        await asyncio.sleep(2)

        # 1. dashboard-pan-india.png
        p1 = os.path.join(SCREENSHOT_DIR, "dashboard-pan-india.png")
        await client.capture_screenshot(p1)

        # 2. dashboard-dark.png
        p2 = os.path.join(SCREENSHOT_DIR, "dashboard-dark.png")
        await client.capture_screenshot(p2)

        # 3. dashboard-light.png
        # Switch to light theme via JS
        await client.evaluate("""
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('jalsuraksha_theme', 'light');
        """)
        await asyncio.sleep(1)
        p3 = os.path.join(SCREENSHOT_DIR, "dashboard-light.png")
        await client.capture_screenshot(p3)

        # Revert to dark theme for remaining captures
        await client.evaluate("""
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('jalsuraksha_theme', 'dark');
        """)
        await asyncio.sleep(0.5)

        # 4. groundwater-map.png (Switch mode to recharge suitability, navigate to RJ/Jaipur)
        await client.send_cmd("Page.navigate", {"url": "http://localhost:3000/?year=2026&state=RJ&region=jaipur&mode=recharge"})
        await asyncio.sleep(2)
        p4 = os.path.join(SCREENSHOT_DIR, "groundwater-map.png")
        await client.capture_screenshot(p4)

        # 5. data-source-coverage.png (Open DataFreshnessModal)
        await client.evaluate("""
            // Click the Sources button in navbar
            const btns = Array.from(document.querySelectorAll('button'));
            const srcBtn = btns.find(b => b.textContent && b.textContent.includes('Sources'));
            if (srcBtn) srcBtn.click();
        """)
        await asyncio.sleep(1)
        p5 = os.path.join(SCREENSHOT_DIR, "data-source-coverage.png")
        await client.capture_screenshot(p5)

        # Close freshness modal
        await client.evaluate("""
            const closeBtn = document.querySelector('button[aria-label="Close dialog"], [role="dialog"] button');
            if (closeBtn) closeBtn.click();
        """)
        await asyncio.sleep(0.5)

        # 6. recommendation-engine.png (Open Decision Suite modal)
        await client.evaluate("""
            const btns = Array.from(document.querySelectorAll('button'));
            const suiteBtn = btns.find(b => b.textContent && b.textContent.includes('Decision Suite'));
            if (suiteBtn) suiteBtn.click();
        """)
        await asyncio.sleep(1.5)
        p6 = os.path.join(SCREENSHOT_DIR, "recommendation-engine.png")
        await client.capture_screenshot(p6)

        # Close suite modal
        await client.evaluate("""
            const closeBtn = document.querySelector('div[role="dialog"] button, [role="dialog"] button');
            if (closeBtn) closeBtn.click();
        """)
        await asyncio.sleep(0.5)

        # 7. groundwater-analytics.png (Open TrumpCard Duel Modal)
        await client.evaluate("""
            const btns = Array.from(document.querySelectorAll('button'));
            const duelBtn = btns.find(b => b.title && b.title.includes('Compare 2 Districts'));
            if (duelBtn) duelBtn.click();
        """)
        await asyncio.sleep(1)
        p7 = os.path.join(SCREENSHOT_DIR, "groundwater-analytics.png")
        await client.capture_screenshot(p7)

        await client.close()
    finally:
        proc.terminate()
        proc.wait()

    # 8. mobile-dashboard.png (Mobile viewport 390x844)
    mobile_proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT + 1}",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=390,844",
        "http://localhost:3000/?year=2026&state=UP&region=agra&mode=water"
    ])

    time.sleep(3)

    try:
        r = requests.get(f"http://127.0.0.1:{CDP_PORT + 1}/json")
        tabs = [t for t in r.json() if t.get("type") == "page"]
        target_tab = tabs[0]
        mclient = ChromeCDPClient(target_tab["webSocketDebuggerUrl"])
        await mclient.connect()
        await asyncio.sleep(2)
        p8 = os.path.join(SCREENSHOT_DIR, "mobile-dashboard.png")
        await mclient.capture_screenshot(p8)
        await mclient.close()
    finally:
        mobile_proc.terminate()
        mobile_proc.wait()

    print("\nAll 8 screenshots successfully generated in:", SCREENSHOT_DIR)


if __name__ == "__main__":
    asyncio.run(run_capture())
