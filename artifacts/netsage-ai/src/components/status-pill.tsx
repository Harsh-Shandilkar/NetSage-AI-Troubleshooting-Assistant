import type { ReviewStatus, Severity } from '@workspace/api-client-react';

export function SeverityPill({ severity }: { severity: Severity | string }) {
  const color = severity === 'High' ? 'border-destructive/25 bg-destructive/10 text-destructive' : severity === 'Medium' ? 'border-accent/35 bg-accent/15 text-[hsl(32_72%_32%)]' : 'border-primary/25 bg-primary/10 text-primary';
  return <span className={`inline-flex items-center rounded-full border px-2 py-1 font-mono-app text-[10px] font-bold uppercase tracking-wide ${color}`} data-testid={`status-severity-${String(severity).toLowerCase()}`}>{severity}</span>;
}

export function ReviewPill({ status }: { status: ReviewStatus | string }) {
  const color = status === 'accepted' ? 'border-primary/25 bg-primary/10 text-primary' : status === 'rejected' ? 'border-destructive/25 bg-destructive/10 text-destructive' : status === 'edited' ? 'border-accent/35 bg-accent/15 text-[hsl(32_72%_32%)]' : 'border-border bg-muted text-muted-foreground';
  return <span className={`inline-flex items-center rounded-full border px-2 py-1 font-mono-app text-[10px] font-bold uppercase tracking-wide ${color}`} data-testid={`status-review-${String(status).toLowerCase()}`}>{status}</span>;
}
