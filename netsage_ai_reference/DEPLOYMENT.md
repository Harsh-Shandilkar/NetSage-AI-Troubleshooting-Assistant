# Deployment + Submission Checklist

## Local test
- Install dependencies
- Set OPENAI_API_KEY as an environment variable
- Run `python app/app.py`
- Test at least 5 cases from data/cases.csv
- Capture screenshots of the assistant and output

## Deployment
Recommended beginner path: deploy the Flask app to Render/Railway/another Python web host.
1. Create a Git repository containing this folder.
2. Add a `.gitignore` containing `.env`, `__pycache__/`, and virtual-environment folders.
3. Push the project.
4. Create a Python web service.
5. Build command: `pip install -r requirements.txt`
6. Start command: `gunicorn app.app:app`
7. Add OPENAI_API_KEY as a secret/environment variable.
8. Open the public URL and run a real test.
9. Never commit the API key.

## Evaluation
Run all 32 cases and record:
- expected fault
- AI root cause
- confidence
- deterministic checker result
- human decision: Accepted / Edited / Rejected
- correction reason

For the final Responsible AI log, include at least five real examples where the model was wrong, incomplete, or overconfident.

## Submission package
Include:
- cases.csv
- prompt files
- Python checker
- deployed assistant URL (if allowed)
- dashboard
- Responsible AI log
- demo video
- individual project summary
- any required Packet Tracer .pkt file

Before submitting, verify the exact Cisco/AICTE form requirements with your Technology Guide because deadlines and formats can change.
