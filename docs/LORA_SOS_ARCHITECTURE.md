# YatraX offline SOS over LoRa

## Deployable path

1. The traveler phone captures the SOS, GPS coordinates, incident type, severity, and a short note.
2. The phone sends a compact `YATRAX_SOS:{json}` packet over Bluetooth to a Meshtastic-compatible LoRa radio.
3. That radio broadcasts into the encrypted Meshtastic channel. Relay nodes can repeat it without internet.
4. A gateway radio connected to a laptop or Raspberry Pi receives the packet.
5. `scripts/meshtastic-sos-gateway.py` authenticates to `POST /api/sos` and records the packet with `transport: "lora-mesh"`.
6. The admin SOS monitor identifies the packet as LoRa and displays its gateway and radio metadata.

If neither internet nor a LoRa companion is reachable, YatraX retains the alert in its existing device queue and retries the internet route when connectivity returns.

## Hardware for a field demo

- Two or more Meshtastic-supported LoRa radios. One travels with the phone; one acts as the gateway.
- A laptop or Raspberry Pi connected to the gateway radio through USB.
- Radios configured for the same legal regional frequency and the same private encrypted channel.
- A phone with the official Meshtastic app for the first field demo. Native BLE integration into YatraX is a later mobile-app step.

## Gateway setup

```powershell
pip install meshtastic pypubsub
$env:YATRAX_SOS_URL='https://your-yatrax-server.example/api/sos'
$env:LORA_GATEWAY_TOKEN='replace-with-a-long-random-secret'
$env:LORA_GATEWAY_ID='lukla-gateway-01'
python scripts/meshtastic-sos-gateway.py
```

Set the same `LORA_GATEWAY_TOKEN` on the YatraX server. Never put this token in frontend code.

## Safety boundary

LoRa improves transport resilience but does not guarantee delivery. Terrain, antenna placement, radio settings, battery state, congestion, and gateway coverage all matter. An acknowledgment from the YatraX server confirms logging only; it does not confirm emergency-service dispatch.
