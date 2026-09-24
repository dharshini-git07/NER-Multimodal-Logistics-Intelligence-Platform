Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting NER RouteGuard AI - Python FastAPI Backend      " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$env:PYTHONPATH = "$PSScriptRoot"
$venvPython = "$PSScriptRoot\backend\venv\Scripts\python.exe"
$pythonCommand = $venvPython

# The repository may be opened on a different machine than the one where the
# virtual environment was created. Use the active Python installation if that
# copied venv no longer has a valid interpreter.
if (-not (Test-Path $venvPython)) {
    $pythonCommand = "python"
} else {
    & $venvPython --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host " Bundled venv is not portable; using system Python." -ForegroundColor Yellow
        $pythonCommand = "python"
    }
}

# Do not use --reload here. On this Windows setup it can leave an orphaned
# reloader process bound to port 8000 without a listening server.
& $pythonCommand -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
