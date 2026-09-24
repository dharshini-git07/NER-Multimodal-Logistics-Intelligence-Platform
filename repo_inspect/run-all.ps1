Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Launching Full Stack NER RouteGuard AI Platform          " -ForegroundColor Green
Write-Host " Problem Statement 26002 - Smart India Hackathon 2026     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run-backend.ps1"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run-frontend.ps1"

Write-Host "`nPlatform services launched:" -ForegroundColor Green
Write-Host "  Backend API:  http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "  API Docs:     http://127.0.0.1:8000/api/v1/docs" -ForegroundColor Cyan
Write-Host "  Frontend App: http://127.0.0.1:5173" -ForegroundColor Cyan
