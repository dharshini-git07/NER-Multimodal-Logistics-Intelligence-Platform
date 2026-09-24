Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting NER RouteGuard AI - React + Vite Frontend       " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\frontend"
# Use the .cmd shim so this works in the default VS Code PowerShell terminal
# even when execution of npm.ps1 is disabled by the machine policy.
npm.cmd run dev
