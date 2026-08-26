#!/usr/bin/env bash
set -e

echo "======================================================="
echo "   NetSage AI — Cisco Network Troubleshooting Lab      "
echo "======================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo "Please install Node.js 18 or newer from: https://nodejs.org/"
    exit 1
fi

# Ensure .env
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "[INFO] Initializing .env from .env.example..."
        cp .env.example .env
    fi
fi

# Launch runner
node scripts/dev.mjs
