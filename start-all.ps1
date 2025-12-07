#!/usr/bin/env powershell
# Retail Genie - Full Stack Startup Script
# Starts all three services in separate terminals

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Retail Genie - Full Stack Startup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Get-Location

# Function to start a service in a new terminal
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [string]$Command,
        [string]$Color
    )
    
    Write-Host "Starting $ServiceName..." -ForegroundColor $Color
    Write-Host "  Path: $ServicePath" -ForegroundColor DarkGray
    Write-Host "  Command: $Command" -ForegroundColor DarkGray
    
    # Start in new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ServicePath'; $Command"
    
    Start-Sleep -Seconds 2
    Write-Host "  ✓ $ServiceName started in new terminal" -ForegroundColor Green
    Write-Host ""
}

# Confirm before proceeding
Write-Host "This will start three services in separate terminals:" -ForegroundColor Yellow
Write-Host "  1. Recommender (FastAPI) - Port 8000" -ForegroundColor White
Write-Host "  2. Orchestrator (Node.js) - Port 5000" -ForegroundColor White
Write-Host "  3. Frontend (React/Vite) - Port 5173" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to continue or Ctrl+C to cancel..." -ForegroundColor Yellow
Read-Host

Clear-Host
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Starting Services..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Start Recommender
$recommenderPath = Join-Path $projectRoot "recommender-fastapi"
$recommenderCmd = ".\venv\Scripts\Activate.ps1; python main.py"
Start-Service "Recommender (FastAPI)" $recommenderPath $recommenderCmd "Blue"

# Start Orchestrator
$orchestratorPath = Join-Path $projectRoot "orchestrator-node"
$orchestratorCmd = "npm start"
Start-Service "Orchestrator (Node.js)" $orchestratorPath $orchestratorCmd "Green"

# Start Frontend
$frontendPath = Join-Path $projectRoot "frontend"
$frontendCmd = "npm run dev"
Start-Service "Frontend (React)" $frontendPath $frontendCmd "Magenta"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "All Services Started!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service Status:" -ForegroundColor Yellow
Write-Host "  • Recommender: http://localhost:8000" -ForegroundColor Blue
Write-Host "  • Orchestrator: http://localhost:5000" -ForegroundColor Green
Write-Host "  • Frontend: http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "Next Step:" -ForegroundColor Yellow
Write-Host "  Open http://localhost:5173 in your browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop all services, close the terminal windows" -ForegroundColor White
Write-Host ""
