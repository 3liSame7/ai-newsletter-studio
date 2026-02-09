Write-Host "========================================"
Write-Host "Starting AI Newsletter Studio..." -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "Starting FastAPI backend on port 8000..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "$projectPath\..\..\langchainenv\Scripts\python.exe" -ArgumentList "-m", "uvicorn", "api:app", "--reload", "--port", "8000" -WorkingDirectory $projectPath -PassThru -NoNewWindow

Start-Sleep -Seconds 3

Write-Host "Starting React frontend on port 5173..." -ForegroundColor Yellow
$frontend = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$projectPath\frontend" -PassThru -NoNewWindow

Write-Host ""
Write-Host "========================================"
Write-Host "AI Newsletter Studio is running!" -ForegroundColor Green
Write-Host "========================================"
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend UI: http://localhost:5173" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers..." -ForegroundColor Yellow
Write-Host ""

# Wait for either process to exit
Wait-Process -Id $backend.Id, $frontend.Id -ErrorAction SilentlyContinue

# Cleanup
Write-Host ""
Write-Host "Stopping servers..." -ForegroundColor Red
Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
Write-Host "Servers stopped." -ForegroundColor Green
