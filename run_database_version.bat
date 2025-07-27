@echo off
echo Starting Umamusume Database Version...
echo.
echo This will start both the API server and HTTP server
echo.
echo API Server: http://localhost:5000
echo Web Interface: http://localhost:8000/gacha_database.html
echo.
echo Press any key to start both servers...
pause > nul

echo.
echo Starting API server on port 5000...
start "API Server" python api_server.py

echo.
echo Starting HTTP server on port 8000...
start "HTTP Server" python serve_http.py

echo.
echo Both servers are starting...
echo.
echo Wait a few seconds, then open: http://localhost:8000/gacha_database.html
echo.
echo Press any key to stop both servers...
pause > nul

echo.
echo Stopping servers...
taskkill /f /im python.exe > nul 2>&1
echo Servers stopped.
pause 