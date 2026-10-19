import asyncio
import base64
import json
import os
import subprocess
import time
import requests
import websockets
from PIL import Image

SCREENSHOT_DIR = os.path.abspath(r"docs\screenshots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CDP_PORT = 9222


class CDPSession:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.msg_id = 0
        self.ws = None

    async def __aenter__(self):
        self.ws = await websockets.connect(self.ws_url, max_size=100 * 1024 * 1024)
        await self.send("Page.enable")
        await self.send("Runtime.enable")
        return self

    async def __aexit__(self, exc_type, exc, tb):
        if self.ws:
            await self.ws.close()

    async def send(self, method, params=None):
        self.msg_id += 1
        cid = self.msg_id
        payload = {"id": cid, "method": method, "params": params or {}}
        await self.ws.send(json.dumps(payload))
        while True:
            raw = await self.ws.recv()
            data = json.loads(raw)
            if data.get("id") == cid:
                return data.get("result", {})

    async def eval_js(self, js):
        res = await self.send("Runtime.evaluate", {
            "expression": js,
            "awaitPromise": True,
            "returnByValue": True
        })
        return res.get("result", {}).get("value")

    async def navigate_and_wait(self, url):
        self.msg_id += 1
        cid = self.msg_id
        await self.ws.send(json.dumps({"id": cid, "method": "Page.navigate", "params": {"url": url}}))
        while True:
            raw = await self.ws.recv()
            data = json.loads(raw)
            if data.get("method") == "Page.loadEventFired":
                break
        await asyncio.sleep(2)

    async def capture(self, filename):
        filepath = os.path.join(SCREENSHOT_DIR, filename)
        res = await self.send("Page.captureScreenshot", {"format": "png"})
        png_bytes = base64.b64decode(res["data"])
        with open(filepath, "wb") as f:
            f.write(png_bytes)
        im = Image.open(filepath)
        print(f"Captured: {filename} -> {im.size}, {len(png_bytes):,} bytes")
        return filepath


async def run_desktop():
    print("Launching Desktop Chrome (1440x960)...")
    proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=1440,960"
    ])
    time.sleep(2)

    try:
        tabs = requests.get(f"http://127.0.0.1:{CDP_PORT}/json").json()
        tab = tabs[0]
        async with CDPSession(tab["webSocketDebuggerUrl"]) as cdp:
            # 1. Navigate to main dashboard
            await cdp.navigate_and_wait("http://localhost:3000/?year=2026&state=UP&region=agra&mode=water")

            # Ensure dark theme
            await cdp.eval_js("""
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('jalsuraksha_theme', 'dark');
            """)
            await asyncio.sleep(1)

            # 1. dashboard-pan-india.png
            await cdp.capture("dashboard-pan-india.png")

            # 2. dashboard-dark.png
            await cdp.capture("dashboard-dark.png")

            # 3. dashboard-light.png
            await cdp.eval_js("""
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('jalsuraksha_theme', 'light');
            """)
            await asyncio.sleep(1)
            await cdp.capture("dashboard-light.png")

            # Revert to dark theme
            await cdp.eval_js("""
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('jalsuraksha_theme', 'dark');
            """)
            await asyncio.sleep(1)

            # 4. groundwater-map.png (Switch to Recharge Suitability & Rajasthan)
            await cdp.navigate_and_wait("http://localhost:3000/?year=2026&state=RJ&region=jaipur&mode=recharge")
            await asyncio.sleep(1)
            await cdp.capture("groundwater-map.png")

            # 5. data-source-coverage.png (Open Sources Modal)
            await cdp.navigate_and_wait("http://localhost:3000/?year=2026&state=UP&region=agra&mode=water")
            await cdp.eval_js("""
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Sources'));
                if (btn) btn.click();
            """)
            await asyncio.sleep(1.5)
            await cdp.capture("data-source-coverage.png")

            # Close Sources modal
            await cdp.eval_js("""
                const closeBtn = document.querySelector('div[role="dialog"] button');
                if (closeBtn) closeBtn.click();
            """)
            await asyncio.sleep(1)

            # 6. recommendation-engine.png (Open Decision Suite)
            await cdp.eval_js("""
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Decision Suite'));
                if (btn) btn.click();
            """)
            await asyncio.sleep(2)
            await cdp.capture("recommendation-engine.png")

            # Close Decision Suite
            await cdp.eval_js("""
                const closeBtn = document.querySelector('div[role="dialog"] button');
                if (closeBtn) closeBtn.click();
            """)
            await asyncio.sleep(1)

            # 7. groundwater-analytics.png (Open Duel Modal)
            await cdp.eval_js("""
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Duel'));
                if (btn) btn.click();
            """)
            await asyncio.sleep(1.5)
            await cdp.capture("groundwater-analytics.png")

    finally:
        proc.terminate()
        proc.wait()


async def run_mobile():
    print("\nLaunching Mobile Chrome (390x844)...")
    proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=390,844"
    ])
    time.sleep(2)

    try:
        tabs = requests.get(f"http://127.0.0.1:{CDP_PORT}/json").json()
        tab = tabs[0]
        async with CDPSession(tab["webSocketDebuggerUrl"]) as cdp:
            await cdp.navigate_and_wait("http://localhost:3000/?year=2026&state=UP&region=agra&mode=water")
            await asyncio.sleep(2)
            await cdp.capture("mobile-dashboard.png")
    finally:
        proc.terminate()
        proc.wait()


async def main():
    await run_desktop()
    await run_mobile()
    print("\nAll 8 real screenshots captured and saved to:", SCREENSHOT_DIR)


if __name__ == "__main__":
    asyncio.run(main())
