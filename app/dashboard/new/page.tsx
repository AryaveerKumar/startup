"use client";

import { useState } from "react";

const fields = [
  ["ideaTitle", "Idea title", "text"],
  ["problemStatement", "Problem statement", "text"],
  ["targetCustomer", "Target customer", "text"],
  ["geography", "Geography", "text"],
  ["industry", "Industry", "text"],
  ["businessModel", "Business model strength", "select"],
  ["marketValidation", "Market validation", "select"],
  ["competitionDensity", "Competition density", "select"],
  ["differentiation", "Differentiation", "select"],
  ["founderExperience", "Founder experience", "select"],
  ["teamComposition", "Team composition", "select"],
  ["availableBudget", "Budget sufficiency", "select"],
  ["mvpComplexity", "MVP complexity", "select"],
  ["marketingPlan", "Marketing plan maturity", "select"],
  ["pricingClarity", "Pricing clarity", "select"],
  ["retentionPotential", "Retention potential", "select"],
  ["monetizationTimeline", "Monetization timeline", "select"],
  ["technicalAdvantage", "Technical advantage", "select"],
  ["legalRisk", "Legal risk", "select"],
  ["goToMarketReadiness", "Go-to-market readiness", "select"],
  ["urgencyLevel", "Customer urgency level", "select"]
] as const;

const options = [
  { value: "strong", label: "Strong" },
  { value: "moderate", label: "Moderate" },
  { value: "weak", label: "Weak" }
];

export default function NewSubmissionPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setMessage(response.ok ? "Submission saved." : data.error || "Failed");
    if (response.ok) window.location.href = `/dashboard/submissions/${data.id}`;
  };

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2rem))] py-8">
      <h1 className="text-2xl font-semibold">Submit New Idea</h1>
      <p className="mt-2 text-sm text-slate-600">Complete the structured 20-question intake form.</p>

      <form onSubmit={submit} className="mt-6 grid grid-cols-2 gap-4">
        {fields.map(([name, label, type]) => (
          <label key={name} className="text-sm">
            <span className="mb-1 block text-slate-700">{label}</span>
            {type === "text" ? (
              <input
                className="w-full rounded-md border border-slate-300 p-2"
                value={form[name] || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
                required
              />
            ) : (
              <select
                className="w-full rounded-md border border-slate-300 p-2"
                value={form[name] || "moderate"}
                onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
                required
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            )}
          </label>
        ))}
        <label className="col-span-2 text-sm">
          <span className="mb-1 block text-slate-700">Additional notes</span>
          <textarea className="w-full rounded-md border border-slate-300 p-2" rows={3} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
        </label>
        <button className="col-span-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">Save Submission</button>
      </form>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </main>
  );
}
