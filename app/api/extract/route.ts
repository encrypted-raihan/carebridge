import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fileName = typeof body?.fileName === "string" ? body.fileName : "medical-record.pdf";
    const lower = fileName.toLowerCase();

    const type = lower.includes("prescription") || lower.includes("medicine")
      ? "Prescription"
      : lower.includes("discharge")
        ? "Discharge Summary"
        : lower.includes("blood") || lower.includes("lab") || lower.includes("report")
          ? "Lab / Blood Report"
          : "Medical Record";

    // Phase 2 contract: this endpoint is intentionally deterministic for the MVP.
    // Replace this block with the real document/OCR/LLM extraction service once
    // Supabase Storage and an AI provider are connected.
    return NextResponse.json({
      success: true,
      demo: true,
      document: {
        type,
        date: "10 Sep 2026",
        confidence: 0.96,
      },
      clinical: {
        concerns: ["Blood pressure monitoring"],
        medications: type === "Prescription" ? ["Amlodipine 5 mg — once daily"] : [],
        labs: type === "Lab / Blood Report"
          ? [
              { name: "Systolic BP", value: "116", unit: "mmHg", reference: "Page 1" },
              { name: "Diastolic BP", value: "70", unit: "mmHg", reference: "Page 1" },
              { name: "Fasting glucose", value: "94", unit: "mg/dL", reference: "Page 1" },
              { name: "HbA1c", value: "5.4", unit: "%", reference: "Page 1" },
            ]
          : [],
      },
      source: {
        fileName,
        references: [
          { label: "Document type", page: 1 },
          { label: "Date", page: 1 },
          { label: "Extracted values", page: 1 },
        ],
      },
      missing: ["Encounter reason was not clearly documented"],
    });
  } catch {
    return NextResponse.json({ success: false, error: "Could not process the extraction request." }, { status: 400 });
  }
}
