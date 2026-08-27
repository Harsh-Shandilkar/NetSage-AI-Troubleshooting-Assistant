# 🌐 NetSage AI — Cisco Network Troubleshooting Assistant


> **Deterministic Rule Engine + AI-Assisted Cisco Network Troubleshooting with Human Review Workflow.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-c5f74f?logo=postgresql)](https://orm.drizzle.team/)
[![Cisco Packet Tracer](https://img.shields.io/badge/Cisco_Packet_Tracer-Lab_Ready-049fd9?logo=cisco)](https://www.netacad.com/)

---

## 🎯 What NetSage AI Does

1. **Evidence Ingestion**: Accepts raw Cisco IOS command outputs (`show vlan brief`, `show interfaces trunk`, `show ip route`, `show access-lists`, `ipconfig`, `show ip dhcp pool`, etc.).
2. **Deterministic Rule Engine**: Instantly validates evidence against **32 comprehensive Cisco networking rules** covering Layer 1 to Layer 7.
3. **Advisory AI Diagnosis (100% Offline by Default)**: Provides root cause analysis, confidence metrics (`96%`), OSI layer categorization (`Layer 1` to `Layer 7`), and recommended next verification commands.
4. **Human Review Loop**: Every recommendation requires human operator approval, editing, or rejection. No automated production changes are ever executed without operator sign-off.
5. **Telemetry & Audit Log**: Tracks all diagnoses, human decisions, and audit history on the Operations Dashboard and Diagnosis History log.

---
Supported Categories

VLAN
Gateway
DHCP
DNS
Routing
ACL
NAT
Wireless
---

🚀 Getting Started

Requirements

Node.js 18+

pnpm

PostgreSQL / Neon database

Check versions:

node --version
pnpm --version

Install pnpm if required:

npm install -g pnpm
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


👨‍💻 Developer

Harsh Shandilkar

NetSage AI was independently developed as a Cisco network troubleshooting assistant combining Cisco networking concepts, deterministic troubleshooting logic, React and TypeScript, Express REST APIs, PostgreSQL and Drizzle ORM, optional AI assistance, and human-in-the-loop safety principles.
---

## 📄 License
MIT License. Created for Cisco Network Troubleshooting Education & Automation.
