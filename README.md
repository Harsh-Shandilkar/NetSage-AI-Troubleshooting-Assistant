# 🌐 NetSage AI — Cisco Network Troubleshooting Assistant

> **Deterministic Rule Engine + AI-Assisted Cisco Network Troubleshooting with Human Review Workflow.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-c5f74f?logo=postgresql)](https://orm.drizzle.team/)
[![Cisco Packet Tracer](https://img.shields.io/badge/Cisco_Packet_Tracer-Lab_Ready-049fd9?logo=cisco)](https://www.netacad.com/)

---

## ⚡ Quick Start (Run in 10 Seconds)

### 🪟 On Windows (1-Click)
Simply **double-click** the **`start.bat`** file in this folder.  
*(Or right-click and choose "Run with PowerShell" on `start.ps1`)*.

---

### 🍎 On macOS / 🐧 Linux
Open your terminal in this project folder and run:
```bash
chmod +x start.sh
./start.sh
```

---

### 💻 Using Terminal / CLI
```bash
# 1. Install dependencies (if not already installed)
pnpm install

# 2. Start both Backend & Frontend with auto-browser launch
pnpm dev
```
> *(The application automatically verifies prerequisites, compiles the backend, starts all services, and launches your browser to `http://localhost:5173`)*.

---

## 🎯 What NetSage AI Does

1. **Evidence Ingestion**: Accepts raw Cisco IOS command outputs (`show vlan brief`, `show interfaces trunk`, `show ip route`, `show access-lists`, `ipconfig`, `show ip dhcp pool`, etc.).
2. **Deterministic Rule Engine**: Instantly validates evidence against **32 comprehensive Cisco networking rules** covering Layer 1 to Layer 7.
3. **Advisory AI Diagnosis (100% Offline by Default)**: Provides root cause analysis, confidence metrics (`96%`), OSI layer categorization (`Layer 1` to `Layer 7`), and recommended next verification commands.
4. **Human Review Loop**: Every recommendation requires human operator approval, editing, or rejection. No automated production changes are ever executed without operator sign-off.
5. **Telemetry & Audit Log**: Tracks all diagnoses, human decisions, and audit history on the Operations Dashboard and Diagnosis History log.

---

## 📡 Live Services & Navigation

| Route / Service | Local URL | Description |
| :--- | :--- | :--- |
| **🔍 Analysis Console** | [http://localhost:5173](http://localhost:5173) | Interactive Cisco troubleshooting console |
| **📊 Operations Dashboard** | [http://localhost:5173/dashboard](http://localhost:5173/dashboard) | Live severity & category telemetry charts |
| **📜 Diagnosis History** | [http://localhost:5173/history](http://localhost:5173/history) | Searchable audit trail with operator sign-offs |
| **🛡️ Responsible AI** | [http://localhost:5173/responsible-ai](http://localhost:5173/responsible-ai) | Human-in-the-loop safety principles |
| **⚙️ Backend API** | [http://localhost:5000](http://localhost:5000) | Express 5 REST API server |
| **💚 Health Check** | [http://localhost:5000/api/healthz](http://localhost:5000/api/healthz) | API server health probe |
| **📚 Cases Catalog** | [http://localhost:5000/api/cases](http://localhost:5000/api/cases) | 32 pre-loaded reference troubleshooting cases |

---

## 🔌 Cisco Packet Tracer Lab Integration

This project includes a complete simulation lab designed for Cisco Packet Tracer:

- **Lab File**: [`packet_tracer/NetSage_AI_Lab.pkt`](packet_tracer/NetSage_AI_Lab.pkt)
- **Topology Architecture**: [`packet_tracer/TOPOLOGY.md`](packet_tracer/TOPOLOGY.md)
- **32 Scenario Injection Recipes**: [`packet_tracer/SCENARIOS_32_CASES.md`](packet_tracer/SCENARIOS_32_CASES.md)
- **Device Configurations**: [`packet_tracer/configs/`](packet_tracer/configs/)

### How to Demo with Packet Tracer:
1. Open **`packet_tracer/NetSage_AI_Lab.pkt`** in Cisco Packet Tracer.
2. Select a scenario from **`SCENARIOS_32_CASES.md`** (e.g. `C001` VLAN mismatch, `C002` Missing VLAN, or `C005` Wrong Gateway).
3. Inject the fault in Packet Tracer and run the show command.
4. Paste the output into **NetSage AI** (`http://localhost:5173`) and click **Run diagnosis**.
5. Observe the deterministic check, apply the recommended fix in Packet Tracer, and re-verify connectivity.

---

## 🛠️ Project Structure

```text
NetSage-AI/
├── start.bat               <-- Windows 1-Click launcher
├── start.ps1               <-- PowerShell launcher
├── start.sh                <-- macOS / Linux launcher
├── README.md               <-- Master documentation
├── .env.example            <-- Template environment configuration
│
├── artifacts/
│   ├── api-server/         <-- Express 5 backend with rule engine & AI layer
│   │   └── src/
│   │       ├── netsage/    <-- 32 rules, cases dataset, and diagnosis engine
│   │       └── routes/     <-- Resilient REST endpoints
│   ├── netsage-ai/         <-- Vite + React 19 frontend SPA
│   │   └── src/pages/      <-- Home, Dashboard, History, Responsible AI
│   └── mockup-sandbox/     <-- Component preview workspace
│
├── lib/
│   ├── api-spec/           <-- OpenAPI specification & contracts
│   ├── api-zod/            <-- Shared Zod validation schemas
│   ├── api-client-react/   <-- TanStack Query hooks generated from OpenAPI
│   └── db/                 <-- Drizzle ORM schema & PostgreSQL connection
│
├── packet_tracer/          <-- Cisco Packet Tracer lab files & IOS configs
│   ├── NetSage_AI_Lab.pkt  <-- Master Packet Tracer simulation file
│   ├── TOPOLOGY.md         <-- Port map & addressing plan
│   ├── SCENARIOS_32_CASES.md <-- 32 test case recipes
│   └── configs/            <-- IOS configuration scripts for R1, R2, SW1, SW2
│
└── scripts/
    └── dev.mjs             <-- Cross-platform concurrent service runner
```

---

## ⚙️ Environment Variables & Future AI Key Integration

A `.env` file is automatically initialized from `.env.example` on first run:

```env
# PostgreSQL connection string (Neon / local PostgreSQL)
DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require

# Server port
PORT=5000

# Optional: OpenAI API Key for live AI generation
# (If omitted, NetSage operates seamlessly in 100% deterministic rule mode)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### Enabling Live OpenAI (Optional):
To enable live GPT-4o generation at any time:
1. Add `OPENAI_API_KEY=sk-...` to `.env`.
2. Restart the app. NetSage will automatically switch to dynamic AI generation while maintaining deterministic rule validations as a safety baseline.

---

## ☁️ Cloud Deployment Guide

NetSage AI is container-ready and can be deployed in 3 steps to **Render**, **Railway**, **Vercel**, or **AWS**:

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```
2. **Connect Repo to Cloud Host**:
   - **Build Command**: `pnpm run build`
   - **Start Command**: `node artifacts/api-server/dist/index.mjs`
3. **Configure Environment Variables in Dashboard**:
   - `DATABASE_URL`: `postgresql://...`
   - `PORT`: `5000`
   - `OPENAI_API_KEY`: *(Optional)*

---

## ❓ Troubleshooting & Developer Commands

```bash
# Typecheck all 9 workspaces
pnpm run typecheck

# Full production build
pnpm run build

# Push database schema to PostgreSQL
pnpm run db:push
```

<details>
<summary><b>Port 5000 or 5173 is already in use</b></summary>

If an existing server is running on port 5000 or 5173:
- **Windows**: Run `netstat -ano | findstr :5000` and terminate the PID with `taskkill /pid <PID> /F`.
- **macOS / Linux**: Run `kill -9 $(lsof -t -i:5000)`.
</details>

<details>
<summary><b>Running without an OpenAI API Key</b></summary>

NetSage AI is engineered to function out of the box with zero external API dependencies. All 32 Cisco networking rules operate deterministically and extract evidence without requiring an OpenAI API key.
</details>

---

## 📄 License
MIT License. Created for Cisco Network Troubleshooting Education & Automation.
