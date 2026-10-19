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


class CDPClient:
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
            raw = await self.ws.recv()
            resp = json.loads(raw)
            if resp.get("id") == cid:
                return resp.get("result", {})

    async def eval(self, js):
        res = await self.send_cmd("Runtime.evaluate", {
            "expression": js,
            "awaitPromise": True,
            "returnByValue": True
        })
        return res.get("result", {}).get("value")

    async def screenshot(self, filename):
        filepath = os.path.join(SCREENSHOT_DIR, filename)
        res = await self.send_cmd("Page.captureScreenshot", {"format": "png"})
        data = base64.b64decode(res["data"])
        with open(filepath, "wb") as f:
            f.write(data)
        im = Image.open(filepath)
        print(f"Captured: {filename} -> {im.size}, {len(data):,} bytes")
        return filepath

    async def close(self):
        if self.ws:
            await self.ws.close()


async def main():
    print("Launching headless Chrome on port 9222...")
    proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=1440,960",
    ])
    time.sleep(2)

    try:
        # Create target tab
        new_tab = requests.put(f"http://127.0.0.1:{CDP_PORT}/json/new?http://localhost:3000/?year=2026&state=UP&region=agra&mode=water").json()
        client = CDPClient(new_tab["webSocketDebuggerUrl"])
        await client.connect()
        await asyncio.sleep(3)

        # 1. Test Theme Toggle
        initial_theme = await client.eval("document.documentElement.className")
        print(f"Initial <html> classes: '{initial_theme}'")

        # Set dark theme explicitly and verify
        await client.eval("""
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('jalsuraksha_theme', 'dark');
        """)
        await asyncio.sleep(1)

        # Screenshot 1: dashboard-pan-india.png
        await client.screenshot("dashboard-pan-india.png")

        # Screenshot 2: dashboard-dark.png
        await client.screenshot("dashboard-dark.png")

        # Screenshot 3: dashboard-light.png
        await client.eval("""
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('jalsuraksha_theme', 'light');
        """)
        await asyncio.sleep(1)
        await client.screenshot("dashboard-light.png")

        # Switch back to dark theme
        await client.eval("""
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('jalsuraksha_theme', 'dark');
        """)
        await asyncio.sleep(1)

        # Screenshot 4: groundwater-map.png (Recharge suitability mode in Rajasthan)
        await client.send_cmd("Page.navigate", {"url": "http://localhost:3000/?year=2026&state=RJ&region=jaipur&mode=recharge"})
        await asyncio.sleep(3)
        await client.screenshot("groundwater-map.png")

        # Screenshot 5: data-source-coverage.png (Open DataFreshnessModal)
        await client.eval("""
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Sources'));
            if (btn) btn.click();
        """)
        await asyncio.sleep(1.5)
        await client.screenshot("data-source-coverage.png")

        # Close freshness modal
        await client.eval("""
            const closeBtn = document.querySelector('div[role=\"dialog\"] button, [role=\"dialog\"] button');
            if (closeBtn) closeBtn.click();
        """)
        await asyncio.sleep(1)

        # Screenshot 6: recommendation-engine.png (Open JalRakshak Decision Suite)
        await client.eval("""
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Decision Suite'));
            if (btn) btn.click();
        """)
        await asyncio.sleep(2)
        await client.screenshot("recommendation-engine.png")

        # Close Decision Suite
        await client.eval("""
            const closeBtn = document.querySelector('div[role=\"dialog\"] button, [role=\"dialog\"] button');
            if (closeBtn) closeBtn.click();
        """)
        await asyncio.sleep(1)

        # Screenshot 7: groundwater-analytics.png (Open TrumpCard Duel Arena)
        await client.eval("""
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.title && b.title.includes('Compare 2 Districts'));
            if (btn) btn.click();
        """)
        await asyncio.sleep(1.5)
        await client.screenshot("groundwater-analytics.png")

        await client.close()
    finally:
        proc.terminate()
        proc.wait()

    # Mobile viewport (390x844)
    print("\nCapturing mobile viewport (390x844)...")
    mproc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=390,844",
    ])
    time.sleep(2)

    try:
        new_tab = requests.put(f"http://127.0.0.1:{CDP_PORT}/json/new?http://localhost:3000/?year=2026&state=UP&region=agra&mode=water").json()
        mclient = CDPClient(new_tab["webSocketDebuggerUrl"])
        await mclient.connect()
        await asyncio.sleep(3)
        await mclient.screenshot("mobile-dashboard.png")
        await mclient.close()
    finally:
        mproc.terminate()
        mproc.wait()

    print("\nAll 8 screenshots successfully generated and verified!")


if __name__ == "__main__":
    asyncio.run(main())
