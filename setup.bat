@echo off
echo ========================================
echo    Umamusume Gacha Calculator Setup
echo ========================================
echo.
echo Installing Python dependencies...
pip install -r database/requirements.txt

echo.
echo Testing database connection...
python test_database.py

echo.
echo Setup complete!
echo.
echo To start the application, run: start.bat
echo.
pause 