import os, json, csv
from pathlib import Path
from flask import Flask, render_template_string, request, jsonify
from checker import check_case

app = Flask(__name__)

HTML = """<!doctype html>
<html><head><meta charset="utf-8"><title>NetSage AI</title>
<style>
body{font-family:Arial,sans-serif;max-width:1050px;margin:30px auto;padding:0 18px;background:#f5f7fb;color:#18202a}
.card{background:white;border-radius:14px;padding:22px;margin:16px 0;box-shadow:0 2px 12px #0001}
textarea{width:100%;min-height:120px;padding:10px;box-sizing:border-box}
button{padding:11px 18px;border:0;border-radius:9px;cursor:pointer}
.primary{background:#111;color:white}.tag{display:inline-block;padding:5px 9px;border-radius:12px;background:#e9eef8;margin:3px}
pre{white-space:pre-wrap;background:#f0f2f5;padding:15px;border-radius:8px}
</style></head><body>
<h1>NetSage AI</h1><p>Human-reviewed Cisco network troubleshooting assistant.</p>
<div class="card">
<form method="post">
<label><b>Symptom</b></label><textarea name="symptom" placeholder="Example: PC cannot ping the gateway...">{{symptom}}</textarea>
<label><b>show-command output</b></label><textarea name="output" placeholder="Paste Packet Tracer output here...">{{output}}</textarea>
<button class="primary" type="submit">Analyze</button>
</form></div>
{% if result %}
<div class="card"><h2>Deterministic checks</h2>{% for x in checks %}<div class="tag">{{x.category}} — {{x.severity}}</div><p>{{x.finding}}</p>{% else %}<p>No deterministic rule matched. Use human review.</p>{% endfor %}</div>
<div class="card"><h2>AI diagnosis</h2><pre>{{result}}</pre><p><b>Human review required:</b> Yes. Do not apply changes automatically.</p></div>
{% endif %}
</body></html>"""

def ai_diagnose(symptom, output, checks):
    # Optional OpenAI integration. Without an API key the app remains a deterministic demo.
    key=os.getenv("OPENAI_API_KEY")
    if not key:
        return json.dumps({
            "root_cause":"AI API key not configured; deterministic findings are shown for human review.",
            "confidence":0,"osi_layer":"Unknown",
            "evidence":[x["finding"] for x in checks],
            "next_command":"Run the most relevant show command and review the full topology.",
            "fix_steps":["Do not apply a configuration change yet.","Review the deterministic findings with a human reviewer."],
            "risk":"High","human_review_required":True
        }, indent=2)
    try:
        from openai import OpenAI
        client=OpenAI(api_key=key)
        prompt=Path(__file__).resolve().parent.parent.joinpath("prompts","diagnose_prompt.md").read_text()
        user=f"SYMPTOM:\n{symptom}\n\nCOMMAND OUTPUT:\n{output}\n\nDETERMINISTIC CHECKS:\n{json.dumps(checks)}"
        r=client.responses.create(model=os.getenv("OPENAI_MODEL","gpt-5.6-mini"), input=prompt+"\n\n"+user)
        return r.output_text
    except Exception as e:
        return json.dumps({"error":"AI call failed","details":str(e),"human_review_required":True},indent=2)

@app.route("/", methods=["GET","POST"])
def home():
    symptom=output=result=""
    checks=[]
    if request.method=="POST":
        symptom=request.form.get("symptom","")
        output=request.form.get("output","")
        checks=check_case(symptom,output)
        result=ai_diagnose(symptom,output,checks)
    return render_template_string(HTML,symptom=symptom,output=output,result=result,checks=checks)

@app.route("/api/analyze", methods=["POST"])
def api_analyze():
    data=request.get_json(force=True)
    symptom=data.get("symptom","")
    output=data.get("output","")
    checks=check_case(symptom,output)
    return jsonify({"checks":checks,"diagnosis":json.loads(ai_diagnose(symptom,output,checks))})

if __name__=="__main__":
    app.run(host="0.0.0.0",port=int(os.getenv("PORT","5000")))
