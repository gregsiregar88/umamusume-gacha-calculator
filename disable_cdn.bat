@echo off
echo 🏠 Disabling CDN - Using Local Images
echo ========================================
echo.

REM Check if config.js exists
if not exist "config.js" (
    echo ❌ config.js not found. Please run setup first.
    pause
    exit /b 1
)

echo Disabling CDN mode...

REM Create a temporary Node.js script to disable CDN
(
echo const fs = require^('fs'^);
echo.
echo // Disable CDN
echo const configPath = './config.js';
echo let configContent = fs.readFileSync^(configPath, 'utf8'^);
echo configContent = configContent.replace^('enabled: true', 'enabled: false'^);
echo fs.writeFileSync^(configPath, configContent^);
echo.
echo console.log^('✅ CDN disabled successfully!'^);
echo console.log^('🏠 Images will now be served locally from /assets/'^);
) > temp_disable_cdn.js

node temp_disable_cdn.js
if errorlevel 1 (
    echo ❌ Failed to disable CDN
    del temp_disable_cdn.js
    pause
    exit /b 1
)

del temp_disable_cdn.js

echo.
echo 🎉 CDN Disabled!
echo.
echo 📋 Next steps:
echo 1. Restart the server: npm start
echo 2. Images will now be served locally from /assets/
echo.
echo 🏠 Local Base URL: /assets/
echo.
pause 