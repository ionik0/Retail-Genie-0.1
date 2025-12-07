@echo off
REM Start all three services in separate windows
REM Set environment to use E: drive for temp/cache
setlocal enabledelayedexpansion

set TEMP=e:\temp
set TMP=e:\temp
set npm_config_cache=e:\temp\npm-cache
set PIP_CACHE_DIR=e:\temp\pip-cache

echo ============================================
echo 🚀 Starting Retail-Genie Services
echo ============================================

REM Terminal 1: FastAPI Recommender
echo [Terminal 1] Starting FastAPI Recommender Service on port 8000...
start "FastAPI Recommender" cmd /k "cd /d e:\Retail-Genie-0.1\recommender-fastapi && e:\Retail-Genie-0.1\.venv\Scripts\python -m uvicorn main:app --port 8000"

REM Wait 3 seconds
timeout /t 3 /nobreak

REM Terminal 2: Node Orchestrator
echo [Terminal 2] Starting Node Orchestrator on port 5000...
start "Node Orchestrator" cmd /k "cd /d e:\Retail-Genie-0.1\orchestrator-node && npm start"

REM Wait 3 seconds
timeout /t 3 /nobreak

REM Terminal 3: React Frontend
echo [Terminal 3] Starting React Frontend on port 5173...
start "React Frontend" cmd /k "cd /d e:\Retail-Genie-0.1\frontend && npm run dev"

echo ============================================
echo ✅ All services started in separate terminals
echo ============================================
echo.
echo Services running on:
echo   - FastAPI (Recommender): http://localhost:8000
echo   - Node Orchestrator: http://localhost:5000
echo   - React Frontend: http://localhost:5173
echo.
echo Press any key to continue...
pause
