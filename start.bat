@echo off
title NetSage AI — Cisco Troubleshooting Assistant
cls

echo =======================================================
echo    NetSage AI — Cisco Network Troubleshooting Lab
echo =======================================================
echo.

REM 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this system!
    echo Please download and install Node.js 18 or newer from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM 2. Check if .env exists, if not copy .env.example
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Initializing .env from .env.example...
        copy ".env.example" ".env" >nul
    )
)

REM 3. Enable Corepack / pnpm if available
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    call corepack enable >nul 2>nul
)

REM 4. Launch universal runner
echo [INFO] Starting NetSage AI services...
node scripts\dev.mjs

pause
