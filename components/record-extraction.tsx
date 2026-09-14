"use client";

import { useEffect, useState } from "react";

type Lab = { name: string; value: string; unit: string; reference: string };
type Extraction = {
  document: { type: string; date: string; confidence: number };
  clinical: { concerns: string[]; medications: string[]; labs: Lab[] };
  source: { fileName: string; references: { label: string; page: number }[] };
  missing: string[];
  demo?: boolean;
};

export default function RecordExtraction({ fileName, onClose }: { fileName: string; onClose: () => void }) {
  const [stage, setStage] = useState<"processing" | "result" | "error">("processing");
  const [extraction, setExtraction] = useState<Extraction | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 850));
        const response = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Extraction failed");
        if (!cancelled) {
          setExtraction(data);
          setStage("result");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Extraction failed");
          setStage("error");
        }
      }
    };
    run();
    return () => { cancelled = true; };
  }, [fileName]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.currentTarget === e.target && onClose()}>
      <section className="extraction-modal card" role="dialog" aria-modal="true" aria-labelledby="extraction-title">
        <div className="modal-top">
          <div>
            <p className="eyebrow">PHASE 2 · STRUCTURED DATA</p>
            <h2 id="extraction-title">Understand this record</h2>
            <p>{fileName}</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        {stage === "processing" && (
          <div className="extraction-processing">
            <div className="processing-orb"><span /></div>
            <h3>Reading the document…</h3>
            <p>Identifying document type, dates, medications and measurable values.</p>
            <div className="processing-steps">
              <span className="done">✓ File received</span>
              <span className="active">◌ Extracting structured fields</span>
              <span>○ Checking source references</span>
            </div>
          </div>
        )}

        {stage === "error" && (
          <div className="extraction-error">
            <div className="error-icon">!</div>
            <h3>We couldn't extract this record</h3>
            <p>{error}</p>
            <button className="secondary" onClick={onClose}>Close</button>
          </div>
        )}

        {stage === "result" && extraction && (
          <>
            <div className="extraction-banner">
              <span className="success-mark">✓</span>
              <div><strong>Structured data ready</strong><small>Confidence {Math.round(extraction.document.confidence * 100)}% · Every extracted item keeps a source reference.</small></div>
              {extraction.demo && <span className="status-tag">DEMO EXTRACTION</span>}
            </div>

            <div className="extraction-grid">
              <section className="extract-section">
                <p className="eyebrow">DOCUMENT</p>
                <div className="extract-row"><span>Type</span><strong>{extraction.document.type}</strong></div>
                <div className="extract-row"><span>Date</span><strong>{extraction.document.date}</strong></div>
              </section>

              <section className="extract-section">
                <p className="eyebrow">DOCUMENTED CONCERNS</p>
                {extraction.clinical.concerns.map((item) => <div className="extract-chip" key={item}>{item}<small>Page 1</small></div>)}
              </section>

              <section className="extract-section">
                <p className="eyebrow">MEDICATIONS</p>
                {extraction.clinical.medications.length ? extraction.clinical.medications.map((item) => <div className="extract-chip" key={item}>{item}<small>Page 1</small></div>) : <p className="empty-extract">No medication documented in this record.</p>}
              </section>

              <section className="extract-section labs-section">
                <p className="eyebrow">MEASURABLE VALUES</p>
                {extraction.clinical.labs.length ? extraction.clinical.labs.map((lab) => <div className="lab-row" key={lab.name}><div><strong>{lab.name}</strong><small>{lab.reference}</small></div><b>{lab.value} <em>{lab.unit}</em></b></div>) : <p className="empty-extract">No lab values detected.</p>}
              </section>
            </div>

            <div className="missing-note"><strong>Missing / unclear</strong><span>{extraction.missing.join(" · ")}</span></div>
            <div className="source-note"><span>⌁</span><div><strong>Source-linked extraction</strong><small>CareBridge will never invent missing clinical information. The next step will store each field against this source document.</small></div></div>
            <div className="modal-actions"><button className="secondary" onClick={onClose}>Close</button><button className="primary" onClick={onClose}>Save structured record →</button></div>
          </>
        )}
      </section>
    </div>
  );
}
