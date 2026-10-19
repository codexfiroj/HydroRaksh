import subprocess, time, json, requests, asyncio, websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
proc = subprocess.Popen([
    CHROME_PATH,
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--window-size=1440,960"
])
time.sleep(2)
try:
    tabs = requests.get("http://127.0.0.1:9222/json").json()
    tab = tabs[0]
    
    async def test():
        ws = await websockets.connect(tab["webSocketDebuggerUrl"])
        await ws.send(json.dumps({"id": 1, "method": "Page.enable"}))
        await ws.recv()
        await ws.send(json.dumps({"id": 2, "method": "Page.navigate", "params": {"url": "http://localhost:3000/?year=2026&state=UP&region=agra&mode=water"}}))
        while True:
            m = json.loads(await ws.recv())
            if m.get("method") == "Page.loadEventFired":
                break
        await asyncio.sleep(2)

        # Check buttons in document
        js = 'Array.from(document.querySelectorAll("button")).map(b => (b.innerText || b.title || "").trim()).filter(Boolean)'
        await ws.send(json.dumps({"id": 3, "method": "Runtime.evaluate", "params": {"expression": js, "returnByValue": True}}))
        while True:
            r = json.loads(await ws.recv())
            if r.get("id") == 3:
                btns = r["result"]["result"]["value"]
                print(f"Total buttons: {len(btns)}")
                for b in btns[:20]:
                    print(" -", b)
                break
        await ws.close()

    asyncio.run(test())
finally:
    proc.terminate()
