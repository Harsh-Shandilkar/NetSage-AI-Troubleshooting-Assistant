import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(prefix, color, message) {
  const lines = message.toString().split(/\r?\n/);
  for (const line of lines) {
    if (line.trim().length > 0) {
      console.log(`${color}${prefix}${colors.reset} ${line}`);
    }
  }
}

console.log(`\n${colors.bright}${colors.cyan}=====================================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}   NetSage AI — Cisco Troubleshooting Assistant   ${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}=====================================================${colors.reset}\n`);

// 1. Check Node.js version
const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);
if (nodeVersion < 18) {
  console.error(`${colors.red}[ERROR] Node.js 18 or newer is required. You are running Node ${process.version}.${colors.reset}`);
  process.exit(1);
}

// 2. Ensure .env exists
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log(`${colors.yellow}[SETUP] .env file not found. Initializing from .env.example...${colors.reset}`);
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`${colors.green}[SETUP] .env created successfully.${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}[WARNING] Neither .env nor .env.example found.${colors.reset}`);
  }
}

// 3. Resolve pnpm executable
let pnpmCmd = 'pnpm';
try {
  execSync('pnpm --version', { stdio: 'ignore' });
} catch {
  try {
    execSync('corepack pnpm --version', { stdio: 'ignore' });
    pnpmCmd = 'corepack pnpm';
  } catch {
    pnpmCmd = 'npx --yes pnpm';
  }
}

// 4. Check dependencies
const nodeModulesPath = path.join(rootDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log(`${colors.yellow}[SETUP] node_modules missing. Installing dependencies using ${pnpmCmd}...${colors.reset}`);
  try {
    execSync(`${pnpmCmd} install`, { cwd: rootDir, stdio: 'inherit' });
    console.log(`${colors.green}[SETUP] Dependencies installed successfully.${colors.reset}\n`);
  } catch (err) {
    console.error(`${colors.red}[ERROR] Failed to install dependencies: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

// 5. Build backend bundle
console.log(`${colors.blue}[BUILD] Building backend API server...${colors.reset}`);
try {
  execSync(`${pnpmCmd} --filter @workspace/api-server run build`, { cwd: rootDir, stdio: 'inherit' });
  console.log(`${colors.green}[BUILD] Backend build complete.${colors.reset}\n`);
} catch (err) {
  console.error(`${colors.red}[ERROR] Backend build failed: ${err.message}${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.green}[START] Starting Backend API (port 5000) and Frontend UI (port 5173)...${colors.reset}\n`);

// 6. Spawn processes
const isWindows = process.platform === 'win32';

const apiProcess = spawn(
  isWindows ? 'cmd.exe' : 'pnpm',
  isWindows ? ['/c', `${pnpmCmd} --filter @workspace/api-server run start`] : ['--filter', '@workspace/api-server', 'run', 'start'],
  { cwd: rootDir, env: { ...process.env, FORCE_COLOR: '1' } }
);

const uiProcess = spawn(
  isWindows ? 'cmd.exe' : 'pnpm',
  isWindows ? ['/c', `${pnpmCmd} --filter @workspace/netsage-ai run dev`] : ['--filter', '@workspace/netsage-ai', 'run', 'dev'],
  { cwd: rootDir, env: { ...process.env, FORCE_COLOR: '1' } }
);

apiProcess.stdout?.on('data', (data) => log('[API]', colors.cyan, data));
apiProcess.stderr?.on('data', (data) => log('[API]', colors.red, data));

uiProcess.stdout?.on('data', (data) => log('[UI] ', colors.magenta, data));
uiProcess.stderr?.on('data', (data) => log('[UI] ', colors.red, data));

// 7. Auto-open browser when ready
let browserOpened = false;
function checkAndOpenBrowser() {
  if (browserOpened) return;
  const req = http.get('http://localhost:5173/', (res) => {
    if (res.statusCode === 200 && !browserOpened) {
      browserOpened = true;
      console.log(`\n${colors.bright}${colors.green}✔ Services are ready!${colors.reset}`);
      console.log(`  ${colors.bright}Frontend UI:${colors.reset} ${colors.cyan}http://localhost:5173${colors.reset}`);
      console.log(`  ${colors.bright}Backend API:${colors.reset} ${colors.cyan}http://localhost:5000${colors.reset}`);
      console.log(`  ${colors.dim}(Press Ctrl+C to stop all services)${colors.reset}\n`);

      const openCmd = isWindows
        ? 'start http://localhost:5173'
        : process.platform === 'darwin'
        ? 'open http://localhost:5173'
        : 'xdg-open http://localhost:5173';
      try {
        execSync(openCmd, { stdio: 'ignore' });
      } catch {}
    }
  });
  req.on('error', () => {
    setTimeout(checkAndOpenBrowser, 500);
  });
}

setTimeout(checkAndOpenBrowser, 1000);

// 8. Graceful shutdown
function cleanup() {
  console.log(`\n${colors.yellow}[STOP] Shutting down NetSage AI services...${colors.reset}`);
  if (isWindows) {
    if (apiProcess.pid) {
      try { execSync(`cmd /c taskkill /pid ${apiProcess.pid} /T /F`, { stdio: 'ignore' }); } catch {}
    }
    if (uiProcess.pid) {
      try { execSync(`cmd /c taskkill /pid ${uiProcess.pid} /T /F`, { stdio: 'ignore' }); } catch {}
    }
  } else {
    apiProcess.kill('SIGTERM');
    uiProcess.kill('SIGTERM');
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
