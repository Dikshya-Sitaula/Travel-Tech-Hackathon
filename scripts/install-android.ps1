$ErrorActionPreference = 'Stop'

$adb = $null
$command = Get-Command adb.exe -ErrorAction SilentlyContinue
$adbCandidates = @()
if ($command) { $adbCandidates += $command.Source }
if ($env:LOCALAPPDATA) { $adbCandidates += Join-Path $env:LOCALAPPDATA 'Android\Sdk\platform-tools\adb.exe' }
if ($env:USERPROFILE) {
  $adbCandidates += Join-Path $env:USERPROFILE 'AppData\Local\Android\Sdk\platform-tools\adb.exe'
  $adbCandidates += Join-Path $env:USERPROFILE 'AppData\AndroidCLI\sdk\platform-tools\adb.exe'
}
$adbCandidates += 'C:\Users\Legion\AppData\Local\Android\Sdk\platform-tools\adb.exe'

foreach ($candidate in $adbCandidates) {
  if ($candidate -and (Test-Path -LiteralPath $candidate)) {
    $adb = (Resolve-Path -LiteralPath $candidate).Path
    break
  }
}
$projectRoot = Split-Path -Parent $PSScriptRoot
$apk = Join-Path $projectRoot 'android\app\build\outputs\apk\debug\app-debug.apk'

if (-not $adb) { throw 'ADB was not found. Expected it under AppData\Local\Android\Sdk\platform-tools.' }
Write-Output "Using ADB: $adb"
if (-not (Test-Path -LiteralPath $apk)) { throw 'The APK is missing. Build it with android\gradlew.bat assembleDebug.' }

$devices = & $adb devices
$connected = $devices | Where-Object { $_ -match "\tdevice$" }
if (-not $connected) { throw 'No authorized Android phone found. Enable USB debugging, connect the phone, and accept its authorization prompt.' }

& $adb install -r $apk
if ($LASTEXITCODE -ne 0) { throw 'Android installation failed.' }

Write-Output 'YatraX was installed successfully on the connected Android phone.'
