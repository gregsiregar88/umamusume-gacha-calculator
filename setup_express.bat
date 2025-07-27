@echo off
echo 🔧 Setting up Umamusume Database...
echo.
REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Installing dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo Setting up database...
npm run setup
if errorlevel 1 (
    echo ERROR: Failed to setup database
    pause
    exit /b 1
)

echo.
echo Setup complete
echo 1. Run: start_express.bat
echo 2. Or manually: npm start
echo 3. Access at: http://localhost:3000
echo.
pause
