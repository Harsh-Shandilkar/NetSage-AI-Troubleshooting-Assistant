import { AlertTriangle, Inbox, LoaderCircle, RefreshCw } from 'lucide-react';

export function LoadingState({ label = 'Loading operational data' }: { label?: string }) {
  return (
    <div className="space-y-3" data-testid="status-loading">
      <div className="flex items-center gap-3 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin text-primary" /><span>{label}</span></div>
      <div className="h-24 animate-pulse rounded-xl bg-muted/80" />
      <div className="h-16 animate-pulse rounded-xl bg-muted/60" />
    </div>
  );
}

export function ErrorState({ message = 'The service could not return this view.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-6" data-testid="status-error">
      <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" /><div><p className="font-semibold text-foreground">Unable to load data</p><p className="mt-1 text-sm text-muted-foreground">{message}</p>{onRetry && <button onClick={onRetry} data-testid="button-retry" className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary"><RefreshCw className="h-3.5 w-3.5" />Try again</button>}</div></div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-xl border border-dashed border-border bg-card/70 px-6 py-12 text-center" data-testid="status-empty"><Inbox className="mx-auto h-7 w-7 text-primary/70" /><p className="mt-3 font-semibold">{title}</p><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p></div>;
}
