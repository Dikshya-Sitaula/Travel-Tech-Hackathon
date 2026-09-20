"""Bridge YatraX SOS packets from a Meshtastic radio to the YatraX server.

Radio messages must begin with ``YATRAX_SOS:`` followed by compact JSON.
Requires: pip install meshtastic pypubsub
"""

import json
import os
import urllib.request

from meshtastic.serial_interface import SerialInterface
from pubsub import pub

SERVER_URL = os.getenv("YATRAX_SOS_URL", "http://127.0.0.1:5173/api/sos")
GATEWAY_TOKEN = os.getenv("LORA_GATEWAY_TOKEN", "")
GATEWAY_ID = os.getenv("LORA_GATEWAY_ID", "yatrax-gateway-01")
PREFIX = "YATRAX_SOS:"


def forward(packet, _interface):
    decoded = packet.get("decoded", {})
    text = decoded.get("text", "")
    if not text.startswith(PREFIX):
        return

    try:
        payload = json.loads(text[len(PREFIX):])
        payload.update({
            "transport": "lora-mesh",
            "gatewayId": GATEWAY_ID,
            "sourceNode": packet.get("fromId") or packet.get("from"),
            "hops": packet.get("hopStart"),
            "rssi": packet.get("rxRssi"),
            "snr": packet.get("rxSnr"),
        })
        request = urllib.request.Request(
            SERVER_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "X-YatraX-Gateway-Token": GATEWAY_TOKEN},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=10) as response:
            print(f"Forwarded SOS from {payload['sourceNode']}: HTTP {response.status}")
    except Exception as error:
        print(f"Unable to forward SOS packet: {error}")


pub.subscribe(forward, "meshtastic.receive")
radio = SerialInterface()
print(f"YatraX LoRa gateway {GATEWAY_ID} listening; forwarding to {SERVER_URL}")

try:
    input("Press Enter to stop.\n")
finally:
    radio.close()
