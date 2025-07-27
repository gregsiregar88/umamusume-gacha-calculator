@echo off
setlocal enabledelayedexpansion

echo 🚀 Umamusume GitHub Deployment
echo ========================================

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first:
    echo    https://git-scm.com/downloads
    pause
    exit /b 1
)
echo ✅ Git is installed

REM Clean up large files
echo 🧹 Cleaning up large files...

REM Remove database file if it exists
if exist "umamusume_cards.db" (
    del "umamusume_cards.db"
    echo ✅ Removed database file (will be recreated on setup)
)

REM Remove PNG files (keep only SVG)
for /r "assets" %%f in (*.png) do (
    if not "%%~dpf" == "assets\buttons\" (
        del "%%f"
        echo ✅ Removed %%f
    )
)

echo ✅ Cleanup complete

REM Create database setup script for Express.js
echo 🔧 Creating Express.js setup script...
(
echo @echo off
echo echo 🔧 Setting up Umamusume Database...
echo echo.
echo REM Check if Node.js is installed
echo node --version ^>nul 2^>^&1
echo if errorlevel 1 ^(
echo     echo ERROR: Node.js is not installed or not in PATH
echo     echo Please install Node.js from https://nodejs.org/
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo Installing dependencies...
echo npm install
echo if errorlevel 1 ^(
echo     echo ERROR: Failed to install dependencies
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo Setting up database...
echo npm run setup
echo if errorlevel 1 ^(
echo     echo ERROR: Failed to setup database
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo.
echo echo Setup complete! To start the server:
echo echo 1. Run: start_express.bat
echo echo 2. Or manually: npm start
echo echo 3. Access at: http://localhost:3000
echo echo.
echo pause
) > "setup_express.bat"

echo ✅ Created setup_express.bat

REM Create deployment instructions
echo 📝 Creating deployment instructions...
(
echo # GitHub Deployment Instructions
echo.
echo ## Quick Deploy to GitHub
echo.
echo ### 1. Create GitHub Repository
echo 1. Go to https://github.com/new
echo 2. Name: `umamusume-gacha-calculator`
echo 3. Description: `Uma Musume Pretty Derby Gacha Rate Calculator`
echo 4. Make it Public or Private
echo 5. Don't initialize with README (we have one)
echo.
echo ### 2. Run Deployment Script
echo ```bash
echo github_deploy.bat
echo ```
echo.
echo ### 3. Follow the prompts
echo The script will:
echo - Clean up large files
echo - Initialize Git repository
echo - Add all files
echo - Create initial commit
echo - Add GitHub remote
echo - Push to GitHub
echo.
echo ### 4. After Deployment
echo Users can clone and set up:
echo ```bash
echo git clone https://github.com/yourusername/umamusume-gacha-calculator.git
echo cd umamusume-gacha-calculator
echo setup_express.bat
echo start_express.bat
echo ```
echo.
echo ## Manual Deployment
echo.
echo If the script doesn't work, do it manually:
echo.
echo ```bash
echo # Initialize Git
echo git init
echo.
echo # Add files
echo git add .
echo.
echo # Commit
echo git commit -m "Initial commit: Umamusume Gacha Calculator"
echo.
echo # Add remote (replace with your repo URL)
echo git remote add origin https://github.com/yourusername/umamusume-gacha-calculator.git
echo.
echo # Push
echo git push -u origin main
echo ```
echo.
echo ## Repository Structure
echo.
echo ```
echo umamusume-gacha-calculator/
echo ├── src/                    # Source files
echo ├── assets/                 # Images (SVG only)
echo ├── database/               # Database scripts
echo ├── test/                   # Test files
echo ├── setup_express.bat       # Express.js setup
echo ├── start_express.bat       # Express.js startup
echo └── README.md               # Project documentation
echo ```
echo.
echo ## Notes
echo.
echo - Database file is excluded (too large for GitHub)
echo - PNG images are excluded (SVG only for smaller size)
echo - Users must run `setup_express.bat` after cloning
echo - All functionality preserved with Express.js backend
) > "GITHUB_DEPLOY.md"

echo ✅ Created GITHUB_DEPLOY.md

REM Set up Git repository
echo 🔧 Setting up Git repository...

REM Initialize Git
git init
if errorlevel 1 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)
echo ✅ Git repository initialized

REM Add all files
git add .
if errorlevel 1 (
    echo ❌ Failed to add files to Git
    pause
    exit /b 1
)
echo ✅ Files added to Git

REM Create initial commit
git commit -m "Initial commit: Umamusume Gacha Calculator with Express.js"
if errorlevel 1 (
    echo ❌ Failed to create initial commit
    pause
    exit /b 1
)
echo ✅ Initial commit created

REM Get GitHub repository information
echo.
echo 🌐 GitHub Repository Setup
echo ========================================

set /p username="Enter your GitHub username: "
set /p repo_name="Enter repository name (default: umamusume-gacha-calculator): "

if "!repo_name!"=="" set repo_name=umamusume-gacha-calculator

echo.
echo Choose repository URL format:
echo 1. HTTPS (recommended for Personal Access Token)
echo 2. SSH (if you have SSH keys set up)
set /p url_choice="Enter choice (1 or 2): "

if "!url_choice!"=="2" (
    set repo_url=git@github.com:!username!/!repo_name!.git
) else (
    set repo_url=https://github.com/!username!/!repo_name!.git
)

echo.
echo Repository URL: !repo_url!
set /p confirm="Is this correct? (y/n): "

if /i not "!confirm!"=="y" (
    echo Please run the script again with correct information.
    pause
    exit /b 1
)

echo.
echo 🔐 Authentication Setup:
echo If you haven't set up authentication yet:
echo 1. Go to GitHub → Settings → Developer settings → Personal access tokens
echo 2. Generate a new token with 'repo' permissions
echo 3. Use the token as your password when prompted
echo.
pause

REM Add remote and push
echo 🔧 Adding remote and pushing to GitHub...

REM Check if remote already exists
git remote get-url origin >nul 2>&1
if not errorlevel 1 (
    echo Remote already exists, updating...
    git remote set-url origin "!repo_url!"
) else (
    REM Add remote
    git remote add origin "!repo_url!"
    if errorlevel 1 (
        echo ❌ Failed to add remote
        pause
        exit /b 1
    )
)
echo ✅ Remote added/updated

REM Push to GitHub (try main first, then master)
git push -u origin main
if errorlevel 1 (
    echo Trying with master branch...
    git push -u origin master
    if errorlevel 1 (
        echo ❌ Failed to push to GitHub
        echo 💡 Make sure you have access to the repository
        pause
        exit /b 1
    )
)
echo ✅ Pushed to GitHub

echo.
echo 🎉 Deployment successful!
echo 🌐 Your repository: !repo_url!
echo.
echo 📋 Next steps:
echo 1. Share the repository URL
echo 2. Users can clone and run setup_express.bat
echo 3. Enjoy your open-source project!
echo.
pause 