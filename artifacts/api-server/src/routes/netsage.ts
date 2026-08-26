import { and, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  AnalyzeNetworkBody,
  AnalyzeNetworkResponse,
  GetDashboardResponse,
  GetDiagnosisParams,
  GetDiagnosisResponse,
  ListCasesQueryParams,
  ListCasesResponse,
  ListDiagnosesQueryParams,
  ListDiagnosesResponse,
  ReviewDiagnosisBody,
  ReviewDiagnosisParams,
  ReviewDiagnosisResponse,
} from "@workspace/api-zod";
import { db, diagnosesTable, type ReviewEdits } from "@workspace/db";
import { sampleCases } from "../netsage/cases";
import { aiDiagnose } from "../netsage/diagnosis";
import { checkCase, type CheckerFinding, type NetworkCategory } from "../netsage/checker";

const router: IRouter = Router();

const errorMessage = "The request could not be processed.";

type DiagnosisRow = typeof diagnosesTable.$inferSelect;

function toRecord(row: DiagnosisRow) {
  const reviewEdits = (row.reviewEdits ?? null) as ReviewEdits | null;
  const diagnosis = row.diagnosis;
  const rootCause = reviewEdits?.rootCause || diagnosis.rootCause;

  return {
    id: row.id,
    category: row.category as NetworkCategory,
    rootCause,
    confidence: row.confidence,
    severity: row.severity as "Low" | "Medium" | "High",
    reviewStatus: row.reviewStatus as "pending" | "accepted" | "edited" | "rejected",
    createdAt: row.createdAt,
    symptom: row.symptom,
    output: row.output,
    checks: row.checks as CheckerFinding[],
    diagnosis,
    reviewNotes: row.reviewNotes,
    reviewEdits,
  };
}

function parseId(requestParams: unknown) {
  const parsed = GetDiagnosisParams.safeParse(requestParams);
  if (!parsed.success) return null;
  const id = parsed.data.id;
  return Number.isInteger(id) ? id : null;
}

router.post("/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeNetworkBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ issue: parsed.error.issues.length }, "Rejected invalid diagnosis input");
    res.status(400).json({ error: "Enter a category, symptom, and valid command output." });
    return;
  }

  const { category, symptom, output } = parsed.data;
  const checks = checkCase(symptom, output);
  const diagnosis = await aiDiagnose(symptom, output, checks);
  const [created] = await db
    .insert(diagnosesTable)
    .values({
      category,
      symptom,
      output,
      checks,
      diagnosis,
      severity: diagnosis.risk,
      confidence: diagnosis.confidence,
      reviewStatus: "pending",
    })
    .returning();

  if (!created) {
    res.status(500).json({ error: errorMessage });
    return;
  }

  res.json(
    AnalyzeNetworkResponse.parse({
      id: created.id,
      category: created.category,
      checks: created.checks,
      diagnosis: created.diagnosis,
      createdAt: created.createdAt,
    }),
  );
});

router.get("/diagnoses", async (req, res): Promise<void> => {
  const parsed = ListDiagnosesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid history filters." });
    return;
  }

  const filters = [];
  if (parsed.data.category) filters.push(eq(diagnosesTable.category, parsed.data.category));
  if (parsed.data.reviewStatus) filters.push(eq(diagnosesTable.reviewStatus, parsed.data.reviewStatus));

  const rows = await db
    .select()
    .from(diagnosesTable)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(diagnosesTable.createdAt))
    .limit(parsed.data.limit);

  res.json(
    ListDiagnosesResponse.parse(
      rows.map((row) => {
        const record = toRecord(row);
        return {
          id: record.id,
          category: record.category,
          rootCause: record.rootCause,
          confidence: record.confidence,
          severity: record.severity,
          reviewStatus: record.reviewStatus,
          createdAt: record.createdAt,
        };
      }),
    ),
  );
});

router.get("/diagnoses/:id", async (req, res): Promise<void> => {
  const id = parseId(req.params);
  if (!id) {
    res.status(400).json({ error: "Invalid diagnosis id." });
    return;
  }

  const [row] = await db.select().from(diagnosesTable).where(eq(diagnosesTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Diagnosis not found." });
    return;
  }

  res.json(GetDiagnosisResponse.parse(toRecord(row)));
});

router.post("/diagnoses/:id", async (req, res): Promise<void> => {
  const id = parseId(req.params);
  if (!id) {
    res.status(400).json({ error: "Invalid diagnosis id." });
    return;
  }

  const parsed = ReviewDiagnosisBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Choose a review decision and provide valid notes." });
    return;
  }
  if (parsed.data.status === "edited" && !parsed.data.edits) {
    res.status(400).json({ error: "Edited diagnoses must include the reviewed recommendation." });
    return;
  }

  const [updated] = await db
    .update(diagnosesTable)
    .set({
      reviewStatus: parsed.data.status,
      reviewNotes: parsed.data.notes?.trim() || null,
      reviewEdits: parsed.data.edits ?? null,
      reviewedAt: new Date(),
    })
    .where(eq(diagnosesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Diagnosis not found." });
    return;
  }

  req.log.info({ diagnosisId: id, reviewStatus: parsed.data.status }, "Recorded human review");
  res.json(ReviewDiagnosisResponse.parse(toRecord(updated)));
});

router.get("/dashboard", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      category: diagnosesTable.category,
      severity: diagnosesTable.severity,
      confidence: diagnosesTable.confidence,
      reviewStatus: diagnosesTable.reviewStatus,
    })
    .from(diagnosesTable);

  const severityCounts = { high: 0, medium: 0, low: 0 };
  const reviewCounts = { pending: 0, accepted: 0, edited: 0, rejected: 0 };
  const categoryMap = new Map<string, number>();

  for (const row of rows) {
    const severity = row.severity.toLowerCase() as keyof typeof severityCounts;
    if (severity in severityCounts) severityCounts[severity] += 1;
    const status = row.reviewStatus as keyof typeof reviewCounts;
    if (status in reviewCounts) reviewCounts[status] += 1;
    categoryMap.set(row.category, (categoryMap.get(row.category) ?? 0) + 1);
  }

  const categoryCounts = [...categoryMap.entries()]
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([category, count]) => ({ category, count }));
  const averageConfidence =
    rows.length > 0
      ? Math.round(rows.reduce((sum, row) => sum + row.confidence, 0) / rows.length)
      : null;

  res.json(
    GetDashboardResponse.parse({
      totalDiagnoses: rows.length,
      severityCounts,
      averageConfidence,
      reviewCounts,
      categoryCounts,
      dataAvailability:
        rows.length > 0
          ? "Live metrics from saved diagnoses."
          : "No saved diagnoses yet. Run a real analysis to populate this dashboard.",
    }),
  );
});

router.get("/cases", async (req, res): Promise<void> => {
  const parsed = ListCasesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid case filter." });
    return;
  }

  const cases = parsed.data.category
    ? sampleCases.filter((item) => item.category === parsed.data.category)
    : sampleCases;
  res.json(ListCasesResponse.parse(cases));
});

export default router;