# YatraX Android demo

The Android project packages the existing React application with Capacitor. No second frontend is maintained.

## Demo architecture

- Android phone: Capacitor WebView running the YatraX traveler UI.
- Laptop: Vite development server and the hackathon SOS/Gemini API handlers.
- Emergency Center: open `/emergency-center` on the laptop.
- Native BLE can connect the Android app to a YatraX-compatible companion LoRa radio. The app never claims the phone contains a LoRa radio.
- Without compatible hardware, simulated SMS and LoRa remain explicitly labeled.

## Requirements

Install Android Studio with its Android SDK and an Android-compatible JDK. Enable USB debugging on the Android phone, or use Android Studio's emulator.

## One-time setup

```powershell
cd C:\Users\Legion\OneDrive\Desktop\YatraX\Travel-Tech-Hackathon
npm install
npm run android:add
```

The `android:add` step is already complete when the `android` folder exists.

## Run the phone demo

Connect the laptop and Android phone to the same Wi-Fi or phone hotspot.

Terminal 1:

```powershell
cd C:\Users\Legion\OneDrive\Desktop\YatraX
npm run dev
```

Use the port printed by Vite. If it is not `5174`, set the port before syncing:

```powershell
$env:YATRAX_DEMO_PORT='5173'
```

Terminal 2:

```powershell
cd C:\Users\Legion\OneDrive\Desktop\YatraX\Travel-Tech-Hackathon
npm run build
npm run android:demo
npm run android:open
```

In Android Studio, select the connected phone and press Run.

## SOS demonstration

1. Open Emergency SOS on the Android phone.
2. Select an emergency and severity.
3. Select **Simulate No Connectivity** and hold **Activate SOS** for three seconds.
4. The event is stored as `QUEUED_OFFLINE`.
5. Select **Simulate LoRa Success**, then choose **Retry selected channel**.
6. Open `http://localhost:<port>/emergency-center` on the laptop.
7. The same event appears for acknowledgement and resolution.

## Real BLE + LoRa mesh path

1. Flash companion firmware implementing `docs/BLE_LORA_MESH_PROTOCOL.md` onto the BLE/LoRa radio.
2. Open Emergency SOS in the installed Android app.
3. Select **Pair BLE radio**, choose the advertising YatraX radio, and accept Android permissions.
4. Wait for **CONNECTED** and **RADIO LINK READY**.
5. Disconnect internet or make the emergency server unreachable.
6. Hold **Activate SOS** for three seconds.
7. The app writes the compact packet over BLE and waits up to 15 seconds for a matching mesh acknowledgement.
8. A confirmed gateway receipt appears in the app and Emergency Center. If it is not confirmed, the same event is retained in the offline queue.

## Bundled/offline build

`npm run android:sync` packages the compiled web assets inside the APK. The local itinerary and queued SOS UI remain available, but Gemini and the laptop SOS server require a reachable backend. For the complete hackathon demo, use `npm run android:demo` so the native shell points to the laptop server.

The offline assistant has two honest operating levels:

- The verified on-device safety engine is bundled in the APK and works without internet or a laptop. It covers urgent altitude symptoms, getting lost, trail animals, packing, permits, emergency numbers, and saved-trip context.
- Gemma generative responses come from the private Ollama endpoint. In the current demo architecture Ollama runs on the laptop, so the phone must be able to reach the laptop over local Wi-Fi even though public internet is not required. The APK does not currently embed Gemma model weights.

Do not present the laptop-hosted Ollama model as an on-device model. Present it as a private local-network model, with the bundled safety engine as the true phone-offline fallback.

## Production work still required

- Public HTTPS backend and database.
- Authenticated responder roles.
- Push notifications and a real SMS provider.
- Physical companion firmware implementing the documented BLE GATT contract and LoRa relay.
- Play Store signing, privacy policy, consent copy, and production monitoring.
