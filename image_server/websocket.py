import asyncio
import websockets

async def hello():
    async with websockets.connect(
            'ws://192.168.100.246:9003') as websocket:
        name = input("What's your name? ")
        print(name)
        await websocket.send(name)
asyncio.get_event_loop().run_until_complete(hello())
