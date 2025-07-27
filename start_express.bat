@echo off
echo Starting Umamusume Gacha Express.js Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if database exists
if not exist "umamusume_cards.db" (
    echo Setting up database...
    npm run setup
    if errorlevel 1 (
        echo ERROR: Failed to setup database
        pause
        exit /b 1
    )
)

echo Starting server...
echo.
npm start

pause 