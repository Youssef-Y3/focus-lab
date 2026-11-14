@echo off
chcp 65001 > nul
echo ========================================================
echo   FOCUS LAB × TAFRA — تشغيل خادم محلي (Port 8000)
echo ========================================================
echo.
cd /d "%~dp0FOCUS_LAB_TAFRA_DIGITAL_PRODUCT"
start http://localhost:8000
python -m http.server 8000
pause

