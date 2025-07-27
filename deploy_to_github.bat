@echo off
echo ========================================
echo    Deploy to GitHub
echo    Umamusume Gacha Calculator
echo ========================================
echo.
echo This will:
echo 1. Clean up large files
echo 2. Initialize Git repository
echo 3. Push to GitHub
echo.
echo Make sure you have:
echo - Git installed
echo - GitHub account
echo - Repository created on GitHub
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running deployment script...
call github_deploy.bat

echo.
echo Deployment complete!
pause 