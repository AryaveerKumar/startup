"use client";

import { useEffect, useState } from "react";

type ScoreData = {
  total: number;
  riskTier: string;
  marketDemand: number;
  competition: number;
  scalability: number;
  founderFit: number;
  capitalFeasibility: number;
  executionMarketing: number;
  pillarSummary: Record<string, string>;
  pivotSuggestions: string[];
};

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<string>("DRAFT");
  const [score, setScore] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/submissions/${params.id}/score`)
      .then((res) => res.json())
      .then((data) => {
        if (data.score) setScore(data.score);
        setStatus(data.status || "DRAFT");
      });
  }, [params.id]);

  const generate = async () => {
    setLoading(true);
    setMessage("Generating score...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await fetch(`/api/submissions/${params.id}/score`, { method: "POST" });
    const data = await response.json();
    if (response.ok) {
      setScore(data.score);
      setStatus("SCORED");
      setMessage("Score generated successfully.");
    } else {
      setMessage(data.error || "Failed to score.");
    }
    setLoading(false);
  };

  const rows = score
    ? [
        ["Market Demand", score.marketDemand, 20],
        ["Competition", score.competition, 15],
        ["Scalability", score.scalability, 15],
        ["Founder Fit", score.founderFit, 20],
        ["Capital Feasibility", score.capitalFeasibility, 15],
        ["Execution & Marketing", score.executionMarketing, 15]
      ]
    : [];

  return (
    <main className="mx-auto w-[min(960px,calc(100%-2rem))] py-8">
      <h1 className="text-2xl font-semibold">Submission Analysis</h1>
      <p className="mt-2 text-sm text-slate-600">Status: {status}</p>

      {!score && (
        <button disabled={loading} onClick={generate} className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Processing..." : "Generate Score"}
        </button>
      )}

      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}

      {score && (
        <section className="mt-6 space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold">Overall score: {score.total}/100</h2>
            <p className="text-slate-600">Risk tier: <strong>{score.riskTier}</strong></p>
          </div>

          <div className="card">
            <h3 className="mb-3 text-lg font-semibold">Pillar Breakdown</h3>
            <div className="space-y-3">
              {rows.map(([label, value, max]) => (
                <div key={String(label)}>
                  <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span>{value}/{max}</span></div>
                  <div className="h-2 rounded bg-slate-100">
                    <div className="h-2 rounded bg-accent" style={{ width: `${(Number(value) / Number(max)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">Pillar Explanations</h3>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-600">
              {Object.entries(score.pillarSummary).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
            <button className="mt-4 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium">Explore Pivot Paths</button>
            <a href="/upgrade" className="ml-2 mt-4 inline-block rounded-md bg-accent px-3 py-2 text-sm font-medium text-white">Upgrade for Detailed Blueprint</a>
          </div>

          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">Pivot Suggestions (Free Tier)</h3>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-600">
              {score.pivotSuggestions.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
