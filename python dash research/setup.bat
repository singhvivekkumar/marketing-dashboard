@echo off
REM Setup Script for CRM Analytics Dashboard (Windows)

echo.
echo ====================================
echo CRM Analytics Dashboard Setup
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/4] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error creating virtual environment
    pause
    exit /b 1
)

echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/4] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error installing dependencies
    pause
    exit /b 1
)

echo [4/4] Creating data folder...
if not exist "src\Leads_Data" mkdir src\Leads_Data

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Place your Excel files in: src\Leads_Data\
echo 2. Run the dashboard: python app.py
echo 3. Open: http://localhost:8050
echo.
pause
