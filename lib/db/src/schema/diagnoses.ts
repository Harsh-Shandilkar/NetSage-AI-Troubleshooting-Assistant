import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type CheckerFinding = {
  ruleId: string;
  category: string;
  finding: string;
  severity: string;
  evidence: string[];
};

export type DiagnosisPayload = {
  rootCause: string;
  confidence: number;
  osiLayer: string;
  evidence: string[];
  nextCommand: string;
  fixSteps: string[];
  risk: string;
  humanReviewRequired: boolean;
};

export type ReviewEdits = {
  rootCause?: string;
  nextCommand?: string;
  fixSteps?: string[];
};

export const diagnosesTable = pgTable("diagnoses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  symptom: text("symptom").notNull(),
  output: text("output").notNull(),
  checks: jsonb("checks").$type<CheckerFinding[]>().notNull(),
  diagnosis: jsonb("diagnosis").$type<DiagnosisPayload>().notNull(),
  severity: text("severity").notNull(),
  confidence: integer("confidence").notNull(),
  reviewStatus: text("review_status").notNull().default("pending"),
  reviewNotes: text("review_notes"),
  reviewEdits: jsonb("review_edits").$type<ReviewEdits | null>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});