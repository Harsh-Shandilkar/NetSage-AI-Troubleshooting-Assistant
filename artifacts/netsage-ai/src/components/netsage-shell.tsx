import { Activity, BarChart3, BookOpen, ChevronRight, CircleHelp, History, Network, ShieldCheck, Wifi } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import type { ReactNode } from 'react';
import { useHealthCheck } from '@workspace/api-client-react';

const links = [
  { href: '/', label: 'Run diagnosis', icon: Activity, exact: true },
  { href: '/dashboard', label: 'Operations view', icon: BarChart3 },
  { href: '/history', label: 'Diagnosis history', icon: History },
  { href: '/responsible-ai', label: 'Responsible AI', icon: ShieldCheck },
];

export function NetsageMark() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm" aria-label="NetSage">
      <Network className="h-5 w-5" strokeWidth={2.3} />
    </div>
  );
}

export function NetsageShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const health = useHealthCheck({ query: { staleTime: 30_000 } });
  const healthy = health.data?.status === 'ok' || health.data?.status === 'healthy';

  return (
    <div className="netsage-shell min-h-[100dvh] text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[244px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <NetsageMark />
          <div>
            <div className="font-display text-[15px] font-bold tracking-tight">NETSAGE <span className="text-sidebar-primary">AI</span></div>
            <div className="font-mono-app text-[9px] uppercase tracking-[0.18em] text-sidebar-foreground/55">evidence workspace</div>
          </div>
        </div>
        <div className="mx-6 h-px bg-sidebar-border" />
        <nav className="flex-1 px-3 py-6" aria-label="Primary navigation">
          <p className="eyebrow px-3 pb-3 text-sidebar-foreground/40">Workspace</p>
          <div className="space-y-1">
            {links.map((link) => {
              const active = link.exact ? location === link.href : location.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase().replaceAll(' ', '-')}`} className={`group flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`}>
                  <span className="flex items-center gap-3"><Icon className={`h-[17px] w-[17px] ${active ? 'text-sidebar-primary' : ''}`} /><span>{link.label}</span></span>
                  {active && <ChevronRight className="h-3.5 w-3.5 text-sidebar-primary" />}
                </Link>
              );
            })}
          </div>
          <p className="eyebrow px-3 pb-3 pt-9 text-sidebar-foreground/40">Reference</p>
          <Link href="/responsible-ai" data-testid="link-reference-guide" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground">
            <BookOpen className="h-[17px] w-[17px]" /> Review guide
          </Link>
        </nav>
        <div className="m-4 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold">
            <span className={`h-2 w-2 rounded-full ${health.isLoading ? 'bg-sidebar-foreground/40' : healthy ? 'bg-sidebar-primary' : 'bg-accent'}`} />
            Service status
          </div>
          <p className="font-mono-app text-[10px] leading-relaxed text-sidebar-foreground/55">
            {health.isLoading ? 'Checking API availability…' : healthy ? 'Analysis API operational' : 'API status unavailable'}
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-border/80 bg-background/90 px-5 backdrop-blur lg:ml-[244px] lg:px-10">
        <div className="flex items-center gap-3 lg:hidden">
          <NetsageMark />
          <span className="font-display text-sm font-bold">NETSAGE <span className="text-primary">AI</span></span>
        </div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
          <Wifi className="h-4 w-4 text-primary" />
          <span className="font-mono-app">LOCAL NETWORK EVIDENCE / HUMAN-IN-THE-LOOP</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`h-2 w-2 rounded-full ${health.isLoading ? 'bg-muted-foreground/50' : healthy ? 'bg-primary' : 'bg-accent'}`} />
          <span className="hidden sm:inline">{health.isLoading ? 'Connecting' : healthy ? 'System ready' : 'Check connection'}</span>
        </div>
      </header>

      <div className="border-b border-border bg-sidebar px-3 py-2 lg:hidden">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Mobile navigation">
          {links.map((link) => {
            const active = link.exact ? location === link.href : location.startsWith(link.href);
            const Icon = link.icon;
            return <Link key={link.href} href={link.href} data-testid={`mobile-link-${link.label.toLowerCase().replaceAll(' ', '-')}`} className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/70'}`}><Icon className="h-3.5 w-3.5" />{link.label}</Link>;
          })}
        </nav>
      </div>

      <main className="min-h-[calc(100dvh-68px)] lg:ml-[244px]">{children}</main>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 border-b border-border/80 pb-7 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow mb-3 text-primary">{eyebrow}</p>
        <h1 className="font-display max-w-3xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function SectionLabel({ children, count }: { children: ReactNode; count?: string | number }) {
  return <div className="mb-3 flex items-center gap-2"><span className="eyebrow text-muted-foreground">{children}</span>{count !== undefined && <span className="rounded-full bg-muted px-2 py-0.5 font-mono-app text-[10px] text-muted-foreground">{count}</span>}</div>;
}
