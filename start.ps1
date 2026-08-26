# NetSage AI — Windows PowerShell Launcher
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   NetSage AI — Cisco Network Troubleshooting Lab      " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not found on your system." -ForegroundColor Red
    Write-Host "Please download and install Node.js 18+ from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Ensure .env
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "[INFO] Initializing .env from .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
    }
}

# Launch universal runner
node scripts/dev.mjs
