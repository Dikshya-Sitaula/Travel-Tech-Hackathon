$ErrorActionPreference = 'Stop'
$ollamaExecutable = Join-Path $env:LOCALAPPDATA 'Programs\Ollama\ollama.exe'
$projectRoot = Split-Path -Parent $PSScriptRoot
$modelFile = Join-Path $projectRoot 'models\Modelfile'

if (-not (Test-Path -LiteralPath $ollamaExecutable)) {
  throw 'Ollama is not installed for the current Windows user.'
}

try {
  $response = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:11434/api/tags' -TimeoutSec 2
  if ($response.StatusCode -eq 200) {
    Write-Output 'Ollama is already running on http://127.0.0.1:11434.'
  }
} catch {
  # Start the local service below.
}

if (-not $response -or $response.StatusCode -ne 200) {
  Start-Process -FilePath $ollamaExecutable -ArgumentList 'serve' -WindowStyle Hidden
  Start-Sleep -Seconds 3
  $response = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:11434/api/tags' -TimeoutSec 5
  Write-Output "Ollama started successfully (HTTP $($response.StatusCode))."
}

$models = ($response.Content | ConvertFrom-Json).models
$modelReady = $models | Where-Object { $_.name -eq 'gemma-offline:latest' -or $_.name -eq 'gemma-offline' }
if (-not $modelReady) {
  if (-not (Test-Path -LiteralPath $modelFile)) { throw 'Offline model is missing and models\Modelfile was not found.' }
  Write-Output 'Building gemma-offline from the bundled model. This may take a few minutes...'
  & $ollamaExecutable create gemma-offline -f $modelFile
  if ($LASTEXITCODE -ne 0) { throw 'Unable to create the gemma-offline model.' }
}

Write-Output 'Offline configuration ready: app model gemma-offline is available.'
