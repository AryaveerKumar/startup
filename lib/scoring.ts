import { Submission } from "@prisma/client";

type PillarBreakdown = {
  marketDemand: number;
  competition: number;
  scalability: number;
  founderFit: number;
  capitalFeasibility: number;
  executionMarketing: number;
};

const scoreMap: Record<string, number> = {
  low: 3,
  medium: 2,
  high: 1,
  strong: 3,
  moderate: 2,
  weak: 1,
  yes: 3,
  partial: 2,
  no: 1,
  experienced: 3,
  some: 2,
  beginner: 1,
  simple: 3,
  moderateComplexity: 2,
  complex: 1,
  clear: 3,
  uncertain: 2,
  unclear: 1,
  short: 3,
  mediumTerm: 2,
  long: 1,
  ready: 3,
  almostReady: 2,
  early: 1
};

const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

const scoreFrom = (value: string, max: number) => clamp((scoreMap[value] ?? 2) * (max / 3), max);

export function scoreSubmission(submission: Submission): {
  total: number;
  riskTier: string;
  pillars: PillarBreakdown;
  pillarSummary: Record<string, string>;
  pivotSuggestions: string[];
} {
  const pillars: PillarBreakdown = {
    marketDemand: Math.round((scoreFrom(submission.marketValidation, 10) + scoreFrom(submission.urgencyLevel, 10))),
    competition: Math.round(scoreFrom(submission.competitionDensity, 8) + scoreFrom(submission.differentiation, 7)),
    scalability: Math.round(scoreFrom(submission.businessModel, 8) + scoreFrom(submission.retentionPotential, 7)),
    founderFit: Math.round(scoreFrom(submission.founderExperience, 10) + scoreFrom(submission.teamComposition, 10)),
    capitalFeasibility: Math.round(scoreFrom(submission.availableBudget, 8) + scoreFrom(submission.mvpComplexity, 7)),
    executionMarketing: Math.round(scoreFrom(submission.marketingPlan, 8) + scoreFrom(submission.goToMarketReadiness, 7))
  };

  const total =
    pillars.marketDemand +
    pillars.competition +
    pillars.scalability +
    pillars.founderFit +
    pillars.capitalFeasibility +
    pillars.executionMarketing;

  const riskTier =
    total >= 80
      ? "Strong"
      : total >= 65
        ? "Conditional"
        : total >= 50
          ? "Validation Required"
          : "Elevated Risk";

  const pillarSummary = {
    marketDemand: "Signal quality for customer pain and validated need.",
    competition: "Ability to stand out within incumbent and emerging alternatives.",
    scalability: "Potential to scale delivery and economics over time.",
    founderFit: "Founder capability, domain understanding, and execution readiness.",
    capitalFeasibility: "Alignment between budget and path to initial traction.",
    executionMarketing: "Clarity and realism of go-to-market execution plan."
  };

  const pivotSuggestions = [
    "Narrow the ICP to a single high-urgency segment and reframe onboarding around one measurable pain metric.",
    "Shift distribution from broad paid acquisition to founder-led outbound and partnership channels for month-one traction.",
    "Reduce MVP scope to a single core workflow that validates willingness to pay before feature expansion."
  ];

  return { total, riskTier, pillars, pillarSummary, pivotSuggestions };
}
