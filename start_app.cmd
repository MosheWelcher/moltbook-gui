@echo off
TITLE Moltbook GUI Launcher

:: Try to find npm automatically
SET "NPM_PATH=npm"
IF EXIST "C:\Program Files\nodejs\npm.cmd" SET "NPM_PATH=C:\Program Files\nodejs\npm.cmd"

echo ==========================================
echo         Moltbook GUI Launcher 
echo ==========================================
echo.
echo Detected npm at: %NPM_PATH%
echo.

echo Step 1: Checking dependencies...
IF EXIST "node_modules" (
    echo [OK] Dependencies already installed. Skipping install.
) ELSE (
    echo Dependencies missing. Installing...
    call "%NPM_PATH%" install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] 'npm install' failed.
        echo Please ensure Node.js is installed.
        pause
        exit /b
    )
)

echo.
echo Step 2: Starting the server...
echo.
echo ------------------------------------------
echo Open http://localhost:5173/ in your browser once it starts!
echo ------------------------------------------
echo.
call "%NPM_PATH%" run dev
pause

