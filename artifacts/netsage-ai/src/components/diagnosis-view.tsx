import { CheckCircle2, ClipboardCheck, Copy, FileCode2, LockKeyhole, ShieldAlert, Terminal, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useReviewDiagnosis } from '@workspace/api-client-react';
import type { Diagnosis, DiagnosisRecord, ReviewEdits, ReviewInputStatus } from '@workspace/api-client-react';
import { SeverityPill, ReviewPill } from '@/components/status-pill';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return <button onClick={() => { void navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }} data-testid="button-copy-command" aria-label="Copy command" className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">{copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}</button>;
}

export function DiagnosisView({ diagnosis, checks = [], recordId, reviewStatus, reviewNotes, onReviewed }: { diagnosis: Diagnosis; checks?: DiagnosisRecord['checks']; recordId?: number; reviewStatus?: string; reviewNotes?: string | null; onReviewed?: (record: DiagnosisRecord) => void }) {
  const review = useReviewDiagnosis();
  const [mode, setMode] = useState<ReviewInputStatus | null>(null);
  const [notes, setNotes] = useState(reviewNotes ?? '');
  const [rootCause, setRootCause] = useState(diagnosis.rootCause);
  const [nextCommand, setNextCommand] = useState(diagnosis.nextCommand);
  const [fixSteps, setFixSteps] = useState(diagnosis.fixSteps.join('\n'));
  const canReview = recordId !== undefined;

  const submitReview = () => {
    if (!recordId || !mode) return;
    const edits: ReviewEdits | null = mode === 'edited' ? { rootCause, nextCommand, fixSteps: fixSteps.split('\n').map((step) => step.trim()).filter(Boolean) } : null;
    review.mutate({ id: recordId, data: { status: mode, notes: notes.trim() || undefined, edits } }, { onSuccess: (record) => { setMode(null); onReviewed?.(record); } });
  };

  return (
    <div className="space-y-5" data-testid="panel-diagnosis-result">
      <div className="rounded-xl border border-primary/25 bg-primary/[0.045] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="eyebrow text-primary">Recommended root cause</p><h2 className="mt-2 max-w-2xl text-xl font-bold tracking-tight">{diagnosis.rootCause}</h2></div>
          <div className="flex items-center gap-2"><SeverityPill severity={diagnosis.risk} /><span className="rounded-full border border-primary/20 bg-card px-2 py-1 font-mono-app text-[10px] font-bold text-primary">{diagnosis.confidence}% confidence</span></div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-primary/15 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-accent" />Risk: {diagnosis.risk}</span>
          <span className="flex items-center gap-2"><FileCode2 className="h-4 w-4 text-primary" />{diagnosis.osiLayer}</span>
          <span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-muted-foreground" />Human review {diagnosis.humanReviewRequired ? 'required' : 'recommended'}</span>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between"><div><p className="eyebrow text-muted-foreground">Verification path</p><h3 className="mt-1 font-bold">Next command</h3></div><Terminal className="h-5 w-5 text-primary" /></div>
          <div className="flex items-start justify-between gap-2 rounded-lg bg-sidebar p-4 text-sidebar-foreground"><code className="break-all font-mono-app text-xs leading-6">{diagnosis.nextCommand}</code><CopyButton value={diagnosis.nextCommand} /></div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Run this command on the affected device, then compare its output with the evidence below before making a change.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow text-muted-foreground">Proposed remediation</p><h3 className="mt-1 font-bold">Fix steps</h3></div><ClipboardCheck className="h-5 w-5 text-primary" /></div><ol className="space-y-3">{diagnosis.fixSteps.map((step, index) => <li key={`${step}-${index}`} className="flex gap-3 text-sm leading-5"><span className="font-mono-app text-xs font-bold text-primary">{String(index + 1).padStart(2, '0')}</span><span>{step}</span></li>)}</ol></div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6"><p className="eyebrow text-muted-foreground">Evidence considered</p><h3 className="mt-1 font-bold">Signals supporting this finding</h3><ul className="mt-4 space-y-3">{diagnosis.evidence.map((item, index) => <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-5"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><span>{item}</span></li>)}</ul></div>
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="eyebrow text-muted-foreground">Deterministic checks</p><h3 className="mt-1 font-bold">{checks.length} check{checks.length === 1 ? '' : 's'} returned</h3></div><span className="font-mono-app text-xs text-muted-foreground">RULE ENGINE</span></div><div className="mt-4 space-y-2">{checks.map((check) => <div key={check.ruleId} className="rounded-lg border border-border/80 bg-muted/35 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-mono-app text-[10px] font-bold text-primary">{check.ruleId}</span><SeverityPill severity={check.severity} /></div><p className="mt-2 text-sm leading-5">{check.finding}</p><p className="mt-2 text-xs text-muted-foreground">{check.evidence.length} evidence signal{check.evidence.length === 1 ? '' : 's'}</p></div>)}</div></div>
      </div>
      {canReview && (
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6" data-testid="panel-human-review">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow text-accent">Decision checkpoint</p><h3 className="mt-1 font-bold">Human review</h3><p className="mt-1 text-sm text-muted-foreground">Record what you decided. NetSage never applies a network configuration change.</p></div>{reviewStatus && <ReviewPill status={reviewStatus} />}</div>
          {mode ? <div className="mt-5 space-y-4"><label className="block text-sm font-semibold">Reviewer notes <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} rows={3} data-testid="textarea-review-notes" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal outline-none focus:border-primary" placeholder="What did you verify or change in your assessment?" /></label>{mode === 'edited' && <div className="grid gap-4 lg:grid-cols-2"><label className="text-sm font-semibold">Root cause<textarea value={rootCause} onChange={(event) => setRootCause(event.target.value)} rows={3} data-testid="textarea-edit-root-cause" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal outline-none focus:border-primary" /></label><label className="text-sm font-semibold">Next command<textarea value={nextCommand} onChange={(event) => setNextCommand(event.target.value)} rows={3} data-testid="textarea-edit-command" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono-app text-xs font-normal outline-none focus:border-primary" /></label><label className="text-sm font-semibold lg:col-span-2">Fix steps <textarea value={fixSteps} onChange={(event) => setFixSteps(event.target.value)} rows={4} data-testid="textarea-edit-fix-steps" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal outline-none focus:border-primary" /></label></div>}<div className="flex flex-wrap gap-2"><button onClick={submitReview} disabled={review.isPending} data-testid="button-submit-review" className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">{review.isPending ? 'Saving…' : 'Save decision'}</button><button onClick={() => setMode(null)} data-testid="button-cancel-review" className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">Cancel</button></div>{review.isError && <p className="text-sm text-destructive">Review could not be saved. Try again.</p>}</div> : <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setMode('accepted')} data-testid="button-review-accept" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"><CheckCircle2 className="h-4 w-4" />Accept recommendation</button><button onClick={() => setMode('edited')} data-testid="button-review-edit" className="inline-flex items-center gap-2 rounded-md border border-accent/50 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-[hsl(32_72%_32%)] hover:bg-accent/20"><FileCode2 className="h-4 w-4" />Edit assessment</button><button onClick={() => setMode('rejected')} data-testid="button-review-reject" className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/5"><XCircle className="h-4 w-4" />Reject</button></div>}
        </div>
      )}
    </div>
  );
}
