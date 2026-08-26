import { ArrowRight, ChevronDown, Clock, Filter, History as HistoryIcon, Layers, RefreshCcw, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { NetworkCategory, ReviewStatus, getGetDiagnosisQueryKey, useGetDiagnosis, useListDiagnoses } from '@workspace/api-client-react';
import type { DiagnosisRecord, DiagnosisSummary } from '@workspace/api-client-react';
import { EmptyState, ErrorState, LoadingState } from '@/components/data-state';
import { DiagnosisView } from '@/components/diagnosis-view';
import { NetsageShell, PageIntro, SectionLabel } from '@/components/netsage-shell';
import { ReviewPill, SeverityPill } from '@/components/status-pill';

const categories = ['ALL', ...Object.values(NetworkCategory)];
const reviewStatuses = ['ALL', ...Object.values(ReviewStatus)];

export default function HistoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const queryParams = {
    limit: 50,
    category: selectedCategory !== 'ALL' ? (selectedCategory as NetworkCategory) : undefined,
    reviewStatus: selectedStatus !== 'ALL' ? (selectedStatus as ReviewStatus) : undefined,
  };

  const listQuery = useListDiagnoses(queryParams);
  const detailQuery = useGetDiagnosis(selectedId ?? 0, {
    query: {
      queryKey: getGetDiagnosisQueryKey(selectedId ?? 0),
      enabled: selectedId !== null && selectedId > 0,
    },
  });

  const diagnoses = listQuery.data ?? [];

  return (
    <NetsageShell>
      <div className="mx-auto max-w-[1480px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <PageIntro
          eyebrow="Telemetry / audit trail"
          title="Diagnosis history & review log."
          description="Inspect every recorded network diagnosis, filter by category or review status, examine evidence trails, and submit human sign-offs."
          action={
            <button
              onClick={() => listQuery.refetch()}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Refresh
            </button>
          }
        />

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <Filter className="h-3.5 w-3.5 text-primary" />
              Filters:
            </div>

            {/* Category select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-xs font-semibold outline-none focus:border-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            </div>

            {/* Status select */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-xs font-semibold outline-none focus:border-primary"
              >
                {reviewStatuses.map((st) => (
                  <option key={st} value={st}>
                    Status: {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          <div className="font-mono-app text-xs text-muted-foreground">
            {diagnoses.length} diagnosis {diagnoses.length === 1 ? 'record' : 'records'}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(420px,1.2fr)]">
          {/* Left Column: Diagnosis List */}
          <section className="space-y-3">
            <SectionLabel count={diagnoses.length}>Recorded diagnoses</SectionLabel>

            {listQuery.isLoading ? (
              <LoadingState label="Loading diagnosis records..." />
            ) : listQuery.isError ? (
              <ErrorState
                message="Diagnosis history could not be loaded."
                onRetry={() => listQuery.refetch()}
              />
            ) : diagnoses.length === 0 ? (
              <EmptyState
                title="No diagnoses found"
                description="Run an analysis from the home page or adjust your filter settings."
              />
            ) : (
              <div className="space-y-2.5">
                {diagnoses.map((item: DiagnosisSummary) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`group w-full rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/[0.05] shadow-sm'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono-app text-xs font-bold text-primary">
                            #{item.id}
                          </span>
                          <span className="rounded bg-muted px-2 py-0.5 font-mono-app text-[10px] font-semibold text-muted-foreground">
                            {item.category}
                          </span>
                          <SeverityPill severity={item.severity} />
                        </div>
                        <ReviewPill status={item.reviewStatus} />
                      </div>

                      <p className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug">
                        {item.rootCause}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-mono-app">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                        <span className="font-mono-app font-bold text-primary">
                          {item.confidence}% confidence
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Right Column: Selected Detail & Review Surface */}
          <section className="space-y-3">
            <SectionLabel>Diagnosis inspection</SectionLabel>

            {selectedId === null ? (
              <div className="grid-paper flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
                <HistoryIcon className="h-10 w-10 text-muted-foreground/50" />
                <h3 className="mt-4 text-base font-bold">Select a diagnosis to inspect</h3>
                <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">
                  Click any record from the list on the left to view its detailed root-cause analysis,
                  deterministic findings, and submit operator review.
                </p>
              </div>
            ) : detailQuery.isLoading ? (
              <LoadingState label="Loading diagnosis details..." />
            ) : detailQuery.isError ? (
              <ErrorState
                message="Could not load details for this diagnosis."
                onRetry={() => detailQuery.refetch()}
              />
            ) : detailQuery.data ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-sidebar px-4 py-2.5 text-xs text-sidebar-foreground">
                  <span className="font-mono-app font-bold">
                    INSPECTING RECORD #{detailQuery.data.id}
                  </span>
                  <span className="font-mono-app text-muted-foreground">
                    {new Date(detailQuery.data.createdAt).toLocaleString()}
                  </span>
                </div>

                <DiagnosisView
                  diagnosis={detailQuery.data.diagnosis}
                  checks={detailQuery.data.checks}
                  recordId={detailQuery.data.id}
                  reviewStatus={detailQuery.data.reviewStatus}
                  reviewNotes={detailQuery.data.reviewNotes}
                  onReviewed={() => {
                    listQuery.refetch();
                    detailQuery.refetch();
                  }}
                />
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </NetsageShell>
  );
}
