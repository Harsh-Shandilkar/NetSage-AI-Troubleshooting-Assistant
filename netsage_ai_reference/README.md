# NetSage AI — Cisco Network Troubleshooting Assistant

## What this project does
NetSage AI accepts a networking symptom and Cisco/Packet Tracer command output. A deterministic Python checker looks for known configuration faults, then an optional OpenAI model produces a structured diagnosis. Every result is explicitly marked for human review; the app never changes a network configuration automatically.

## Run locally
1. Install Python 3.10+.
2. Create a virtual environment.
3. `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and set `OPENAI_API_KEY` if you want live AI.
5. Run: `python app/app.py`
6. Open `http://127.0.0.1:5000`

## Important
Do not put an API key into GitHub, Packet Tracer, screenshots, or the submission PDF. Store it as an environment variable on the deployment platform.

## Submission artifacts
- data/cases.csv — 32 original troubleshooting cases
- prompts/diagnose_prompt.md — structured diagnosis prompt
- app/checker.py — deterministic safety/rule checker
- app/app.py — web assistant
- responsible_ai_log.csv — human-review examples
- dashboard.csv — evaluation summary
- Project_Summary_Template.md — individual contribution report template
- DEMO_SCRIPT.md — 5–10 minute demo plan
- DEPLOYMENT.md — deployment checklist
