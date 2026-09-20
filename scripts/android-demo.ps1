$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$wifiAddress = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*' -and $_.InterfaceAlias -match 'Wi-Fi|Wireless' } |
  Select-Object -First 1 -ExpandProperty IPAddress

if (-not $wifiAddress) {
  $wifiBlock = ipconfig | Select-String -Pattern 'IPv4 Address.*:\s*(\d+\.\d+\.\d+\.\d+)' | Select-Object -First 1
  if ($wifiBlock -and $wifiBlock.Matches.Count) { $wifiAddress = $wifiBlock.Matches[0].Groups[1].Value }
}

if (-not $wifiAddress) {
  throw 'No LAN IPv4 address was found. Connect the laptop and Android phone to the same Wi-Fi or hotspot.'
}

$port = if ($env:YATRAX_DEMO_PORT) { $env:YATRAX_DEMO_PORT } else { '5174' }
$env:CAPACITOR_SERVER_URL = "http://${wifiAddress}:$port"

Write-Output "Configuring the Android demo for $env:CAPACITOR_SERVER_URL"
Write-Output 'Keep the YatraX Vite server running on this address while demonstrating the app.'

Push-Location $projectRoot
try {
  if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'dist\index.html'))) {
    throw 'The web build is missing. Run npm run build once, then rerun npm run android:demo.'
  }
  npx cap sync android
} finally {
  Pop-Location
}

Write-Output 'Android project synchronized. Run npm run android:open to build/install it with Android Studio.'
