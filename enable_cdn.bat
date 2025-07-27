@echo off
echo 🌐 Enabling jsDelivr CDN for Image Serving
echo ========================================
echo.

REM Check if config.js exists
if not exist "config.js" (
    echo ❌ config.js not found. Please run setup first.
    pause
    exit /b 1
)

echo Current configuration:
echo - Username: gregsiregar88
echo - Repository: umamusume-gacha-calculator
echo - Branch: main
echo.

set /p username="Enter GitHub username (or press Enter for gregsiregar88): "
if "!username!"=="" set username=gregsiregar88

set /p repo="Enter repository name (or press Enter for umamusume-gacha-calculator): "
if "!repo!"=="" set repo=umamusume-gacha-calculator

set /p branch="Enter branch name (or press Enter for main): "
if "!branch!"=="" set branch=main

echo.
echo Updating configuration...
echo - Username: !username!
echo - Repository: !repo!
echo - Branch: !branch!
echo.

REM Create a temporary Node.js script to update config
(
echo const fs = require^('fs'^);
echo const { updateCdnConfig } = require^('./config'^);
echo.
echo // Update CDN configuration
echo updateCdnConfig^('!username!', '!repo!', '!branch!'^);
echo.
echo // Enable CDN
echo const configPath = './config.js';
echo let configContent = fs.readFileSync^(configPath, 'utf8'^);
echo configContent = configContent.replace^('enabled: false', 'enabled: true'^);
echo fs.writeFileSync^(configPath, configContent^);
echo.
echo console.log^('✅ CDN enabled successfully!'^);
echo console.log^(`🌐 CDN URL: https://cdn.jsdelivr.net/gh/!username!/!repo!@!branch!`^);
) > temp_update_config.js

node temp_update_config.js
if errorlevel 1 (
    echo ❌ Failed to update configuration
    del temp_update_config.js
    pause
    exit /b 1
)

del temp_update_config.js

echo.
echo 🎉 CDN Configuration Updated!
echo.
echo 📋 Next steps:
echo 1. Make sure your repository is pushed to GitHub
echo 2. Restart the server: npm start
echo 3. Images will now be served from jsDelivr CDN
echo.
echo 🌐 CDN Base URL: https://cdn.jsdelivr.net/gh/!username!/!repo!@!branch!
echo.
pause 