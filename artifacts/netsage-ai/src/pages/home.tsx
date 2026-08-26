import { ArrowRight, BookOpen, ChevronDown, Database, FileText, History, LoaderCircle, Play, RotateCcw, ScanSearch, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import { NetworkCategory, useAnalyzeNetwork, useListCases } from '@workspace/api-client-react';
import type { AnalyzeResponse, Case } from '@workspace/api-client-react';
import { DiagnosisView } from '@/components/diagnosis-view';
import { ErrorState, LoadingState } from '@/components/data-state';
import { NetsageShell, PageIntro, SectionLabel } from '@/components/netsage-shell';

const categories = Object.values(NetworkCategory);

export default function Home() {
  const [category, setCategory] = useState<NetworkCategory>(NetworkCategory.VLAN);
  const [symptom, setSymptom] = useState('');
  const [output, setOutput] = useState('');
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const analysis = useAnalyzeNetwork();
  const cases = useListCases();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!symptom.trim()) return;
    analysis.mutate({ data: { category, symptom: symptom.trim(), output } }, { onSuccess: setResult });
  };

  const loadCase = (sample: Case) => {
    setCategory(sample.category);
    setSymptom(sample.symptom);
    setOutput(sample.observedOutput);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NetsageShell>
      <div className="mx-auto max-w-[1480px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <PageIntro eyebrow="Analysis console / ready" title="Turn network evidence into a reviewable next move." description="Paste the symptom and device output. NetSage runs deterministic checks first, then prepares a recommendation for a network operator to verify." action={<Link href="/responsible-ai" data-testid="link-responsible-ai-home" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-foreground"><BookOpen className="h-4 w-4" />How review works <ArrowRight className="h-3.5 w-3.5" /></Link>} />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,.95fr)]">
          <section className="rounded-2xl border border-border bg-card shadow-sm" aria-labelledby="analysis-form-heading">
            <div className="grid-paper rounded-t-2xl border-b border-border/80 px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-primary">01 / Capture evidence</p><h2 id="analysis-form-heading" className="mt-2 text-lg font-bold">What is happening on the network?</h2></div><div className="hidden rounded-lg border border-primary/20 bg-primary/10 p-2.5 text-primary sm:block"><ScanSearch className="h-5 w-5" /></div></div>
            </div>
            <form onSubmit={submit} className="space-y-6 p-5 sm:p-7">
              <label className="block text-sm font-semibold">Network category <span className="font-normal text-muted-foreground">(required)</span><div className="relative mt-2"><select value={category} onChange={(event) => setCategory(event.target.value as NetworkCategory)} data-testid="select-network-category" className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-3 pr-10 text-sm outline-none focus:border-primary">{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-muted-foreground" /></div></label>
              <label className="block text-sm font-semibold">Observed symptom <span className="font-normal text-muted-foreground">(required)</span><textarea value={symptom} onChange={(event) => setSymptom(event.target.value)} maxLength={5000} rows={4} data-testid="textarea-symptom" className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm leading-6 outline-none focus:border-primary" placeholder="Example: Users on VLAN 30 cannot reach the internet after a switch replacement." required /><span className="mt-1 block text-right font-mono-app text-[10px] text-muted-foreground">{symptom.length.toLocaleString()} / 5,000</span></label>
              <label className="block text-sm font-semibold">Command output <span className="font-normal text-muted-foreground">(optional, recommended)</span><textarea value={output} onChange={(event) => setOutput(event.target.value)} maxLength={20000} rows={8} data-testid="textarea-command-output" className="mt-2 w-full resize-y rounded-lg border border-input bg-sidebar px-3 py-3 font-mono-app text-xs leading-5 text-sidebar-foreground outline-none focus:border-primary" placeholder="$ show ip interface brief&#10;Paste raw Cisco output here…" /><span className="mt-1 block text-right font-mono-app text-[10px] text-muted-foreground">{output.length.toLocaleString()} / 20,000</span></label>
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={() => { setSymptom(''); setOutput(''); setResult(null); }} data-testid="button-clear-form" className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><RotateCcw className="h-4 w-4" />Clear</button><button type="submit" disabled={analysis.isPending || !symptom.trim()} data-testid="button-run-analysis" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{analysis.isPending ? <><LoaderCircle className="h-4 w-4 animate-spin" />Running checks…</> : <><Play className="h-4 w-4 fill-current" />Run diagnosis</>}</button></div>
              {analysis.isError && <ErrorState message="The evidence could not be analyzed. Check the service connection and try again." onRetry={() => analysis.mutate({ data: { category, symptom: symptom.trim(), output } })} />}
            </form>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between"><SectionLabel count={cases.data?.length ?? 0}>Load a case</SectionLabel><Database className="h-4 w-4 text-primary" /></div>
              <p className="mb-4 text-sm leading-6 text-muted-foreground">Use a persisted troubleshooting case to see the workspace in motion.</p>
              {cases.isLoading ? <LoadingState label="Loading reference cases" /> : cases.isError ? <ErrorState message="Reference cases are unavailable." onRetry={() => cases.refetch()} /> : cases.data?.length ? <div className="space-y-2">{cases.data.slice(0, 4).map((sample) => <button key={sample.caseId} onClick={() => loadCase(sample)} data-testid={`button-load-case-${sample.caseId}`} className="group w-full rounded-lg border border-border/80 bg-background p-3 text-left hover:border-primary/50 hover:bg-primary/[0.03]"><div className="flex items-center justify-between gap-2"><span className="font-mono-app text-[10px] font-bold text-primary">{sample.caseId}</span><span className="text-[10px] text-muted-foreground">{sample.category}</span></div><p className="mt-2 line-clamp-2 text-sm font-semibold leading-5">{sample.symptom}</p><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">Load evidence <ArrowRight className="h-3 w-3" /></span></button>)}</div> : <p className="text-sm text-muted-foreground">No reference cases are available yet.</p>}
              <Link href="/history" data-testid="link-view-history-home" className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-semibold text-muted-foreground hover:text-primary"><span className="flex items-center gap-2"><History className="h-3.5 w-3.5" />View prior diagnoses</span><ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-sidebar p-5 text-sidebar-foreground shadow-sm sm:p-6"><div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-sidebar-primary/15" /><div className="absolute -right-3 top-0 h-24 w-24 rounded-full border border-sidebar-primary/10" /><TerminalSquare className="mb-8 h-5 w-5 text-sidebar-primary" /><p className="eyebrow text-sidebar-primary">Operator note</p><p className="mt-2 max-w-sm text-sm leading-6 text-sidebar-foreground/75">Evidence stays attached to every recommendation. Nothing leaves this workflow for an automatic change.</p></div>
          </aside>
        </div>

        <section className="mt-10" aria-labelledby="result-heading">
          <div className="mb-4 flex items-end justify-between"><div><p className="eyebrow text-primary">02 / Review result</p><h2 id="result-heading" className="mt-1 text-xl font-bold">Latest diagnosis</h2></div>{result && <span className="font-mono-app text-[10px] text-muted-foreground">CASE #{result.id} · {new Date(result.createdAt).toLocaleString()}</span>}</div>
          {analysis.isPending ? <LoadingState label="Running deterministic checks and preparing recommendation" /> : result ? <DiagnosisView diagnosis={result.diagnosis} checks={result.checks} recordId={result.id} reviewStatus="pending" /> : <div className="grid-paper rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center"><FileText className="mx-auto h-8 w-8 text-primary/60" /><h3 className="mt-4 font-bold">Your review surface is ready</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Submit a symptom and some command output to see the evidence trail, confidence, and proposed next step here.</p></div>}
        </section>
      </div>
    </NetsageShell>
  );
}
