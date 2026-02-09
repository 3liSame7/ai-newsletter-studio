@echo off
echo ========================================
echo Starting AI Newsletter Studio...
echo ========================================
echo.

cd /d "%~dp0"

echo Starting FastAPI backend on port 8000...
start /B "%~dp0..\..\langchainenv\Scripts\python.exe" -m uvicorn api:app --reload --port 8000

timeout /t 3 /nobreak >nul

echo Starting React frontend on port 5173...
cd frontend
start /B npm run dev

echo.
echo ========================================
echo AI Newsletter Studio is running!
echo ========================================
echo Backend API: http://localhost:8000
echo Frontend UI: http://localhost:5173
echo ========================================
echo.
echo Press Ctrl+C to stop all servers...
echo.

:loop
timeout /t 1 /nobreak >nul
goto loop
