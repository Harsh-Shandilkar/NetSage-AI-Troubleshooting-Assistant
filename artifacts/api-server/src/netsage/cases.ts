import casesCsv from "./data/cases.csv";
import type { NetworkCategory, Severity } from "./checker";

export type SampleCase = {
  caseId: string;
  category: NetworkCategory;
  symptom: string;
  command: string;
  observedOutput: string;
  expectedFault: string;
  osiLayer: "Layer 1" | "Layer 2" | "Layer 3" | "Layer 4" | "Layer 7" | "Unknown";
  concept: string;
  severity: Severity;
};

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((item) => item.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const rows = parseCsv(casesCsv);
const headers = rows[0] ?? [];

export const sampleCases: SampleCase[] = rows.slice(1).map((values) => {
  const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  return {
    caseId: record.case_id,
    category: record.category as NetworkCategory,
    symptom: record.symptom,
    command: record.command,
    observedOutput: record.observed_output,
    expectedFault: record.expected_fault,
    osiLayer: record.osi_layer as SampleCase["osiLayer"],
    concept: record.concept,
    severity: record.severity as Severity,
  };
});