# YatraX BLE + LoRa mesh companion protocol

This document defines the interface between the installed YatraX Android application and a companion ESP32/nRF52 LoRa radio. The phone does not transmit LoRa directly.

## Transport path

`YatraX Android app → BLE GATT → companion radio → LoRa mesh → gateway → YatraX emergency server`

The Android app now implements the BLE side. A physical radio must implement the GATT service and perform LoRa transmission before the hardware path can be described as operational.

## BLE service

| Role | UUID | Properties |
| --- | --- | --- |
| YatraX mesh service | `7a545258-0001-4d45-5348-000000000001` | Primary service |
| Phone-to-radio SOS | `7a545258-0002-4d45-5348-000000000002` | Write with response |
| Radio-to-phone acknowledgement | `7a545258-0003-4d45-5348-000000000003` | Notify |

The app remembers the selected device ID and attempts to reconnect at startup.

## SOS frames

The JSON packet is UTF-8 encoded and split according to the negotiated BLE MTU. Every BLE write starts with four bytes:

1. `0x59` (`Y`)
2. `0x58` (`X`)
3. zero-based chunk index
4. total chunk count

The radio reassembles all chunks before parsing the compact JSON payload:

```json
{
  "v": 1,
  "t": "SOS",
  "id": "SOS-20260920-A81F",
  "d": "YX-1042",
  "e": "INJURY",
  "s": "CRITICAL",
  "a": 28.53,
  "o": 83.878,
  "b": 74,
  "ts": "2026-09-20T10:00:00.000Z"
}
```

## Acknowledgement

The companion must notify the acknowledgement characteristic with UTF-8 JSON. YatraX only reports success for one of these confirmed states:

- `MESH_RELAYED`
- `GATEWAY_RECEIVED`
- `SERVER_RECEIVED`
- `ACKNOWLEDGED`

Example:

```json
{
  "eventId": "SOS-20260920-A81F",
  "status": "GATEWAY_RECEIVED",
  "gatewayId": "YX-GW-001",
  "receivedAt": "2026-09-20T10:00:08.000Z",
  "rssi": -72
}
```

If no matching acknowledgement arrives within 15 seconds, the app records `RADIO_ACK_TIMEOUT` and keeps the event in the offline queue. Retrying uses the same event ID, allowing server-side deduplication.

## Gateway ingestion

The gateway forwards the recovered packet to:

`POST /api/emergency/gateway`

Include the configured `X-YatraX-Gateway-Token` header. The backend validates and deduplicates `eventId`, stores the event as `GATEWAY_RECEIVED`, and exposes it in `/emergency-center`.

## Meshtastic compatibility

The YatraX BLE UUIDs are a small custom companion protocol, not the Meshtastic PhoneAPI protobuf protocol. Two supported hardware strategies are possible:

1. Add this GATT service to custom ESP32 firmware and relay the reconstructed packet over LoRa.
2. Build a native Meshtastic adapter that encodes the official `ToRadio` protobuf and uses the Meshtastic service UUID. Do not write YatraX JSON directly to Meshtastic's `toradio` characteristic.

For the current hackathon build, option 1 is the defined integration contract. The browser simulator remains available for demonstrations without physical hardware.
