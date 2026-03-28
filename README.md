# 🌊 APHIP — Adaptive Public Health Intelligence Platform

### Predictive, Explainable Risk Intelligence for Community Health Systems

---

## 🔗 Live System

- 🚀 Live Demo: https://aphip.vercel.app/
- 💻 GitHub: https://github.com/shuva-0/APHIP

---

## ⚡ Core Idea

Public health systems are fundamentally reactive:

- Detection happens after exposure  
- Disease is tracked after spread  
- Intervention happens too late  

**APHIP eliminates this delay.**

It converts structured environmental observations into a:

> Deterministic, explainable, real-time risk intelligence system

---

## 🧠 What APHIP Does

APHIP is a hybrid intelligence engine that:

- Computes risk score (0–100)
- Detects inconsistent inputs
- Generates confidence score
- Explains root causes
- Enables what-if simulation
- Produces ranked interventions
- Tracks risk over time

---

## 🖥️ System Architecture
🚀 BUILD COMPLETE APPLICATION: Adaptive Public Health Intelligence Platform (APHIP)

---

1. OBJECTIVE

Build a production-grade, visually elite, fully interactive web application that functions as a Public Health Decision Intelligence Platform aligned with SDG 3 (Health & Well-being).

The system must:

- Accept structured human observations (NO hardware)
- Convert inputs into normalized quantitative features
- Apply a hybrid model (rule-based + ML-inspired)
- Compute risk score with confidence
- Support real-time updates
- Provide simulation (what-if analysis)
- Optimize intervention strategies
- Provide explainable insights
- Deliver a premium SaaS-level UI (Framer Motion + Tailwind + TypeScript)

This must look like a real-world intelligence dashboard (Palantir/Bloomberg style).

---

2. TECH STACK (MANDATORY)

- React + TypeScript (Vite)
- Tailwind CSS
- Framer Motion
- Recharts
- React Context API
- No backend (all logic client-side)

---

🔧 3. FINAL PROJECT STRUCTURE (MERGED — NO FUNCTIONAL LOSS)

IMPORTANT:

- Files are intentionally merged to reduce file count
- ALL original functionality MUST remain
- Each merged file must internally maintain modular structure

---

src/
├── components/
│   ├── ui/
│   │   ├── index.tsx
│   │
│   ├── dashboard/
│   │   ├── RiskGauge.tsx
│   │   ├── TrendChart.tsx
│   │   ├── FactorBreakdown.tsx
│   │   ├── ConfidenceBar.tsx
│   │
│   ├── panels/
│   │   ├── InputPanel.tsx
│   │   ├── SimulationPanel.tsx
│   │   ├── ActionPanel.tsx
│   │
│   ├── ErrorBoundary.tsx
│
├── context/
│   ├── RiskContext.tsx
│
├── hooks/
│   ├── useRisk.ts
│
├── models/
│   ├── riskEngine.ts
│
├── services/
│   ├── riskService.ts
│
├── router/
│   ├── index.tsx
│
├── layout/
│   ├── MainLayout.tsx
│
├── animations/
│   ├── motionVariants.ts
│
├── config/
│   ├── index.ts
│
├── constants/
│   ├── index.ts
│
├── utils/
│   ├── index.ts
│
├── data/
│   ├── scenarios.ts
│
├── types/
│   ├── index.ts
│
├── pages/
│   ├── Dashboard.tsx
│
├── styles/
│   ├── globals.css
│
├── App.tsx
├── main.tsx

---

4. DATA TYPES (MANDATORY)

export type UserInput = {
  clarity: "clear" | "mild" | "muddy";
  color: "none" | "yellow" | "green" | "brown";
  odor: "none" | "mild" | "strong";

  stagnation: boolean;
  mosquito: "none" | "few" | "many";
  garbage: "low" | "medium" | "high";
  drainage: "good" | "blocked" | "overflow";

  rainfall: "none" | "light" | "heavy";
  duration: "<1" | "1-3" | ">3";
  trend: "improving" | "same" | "worsening";

  usage: "drinking" | "washing" | "none";
  population: "low" | "medium" | "high";
  vulnerable: boolean;

  illness: "none" | "few" | "many";
  illnessType: "fever" | "diarrhea" | "unknown";
};

---

5. FEATURE ENGINEERING

- Normalize all inputs to [0,1]
- Use mappings defined in constants

Derived features:

- WaterRisk
- VectorRisk
- Sanitation
- Exposure
- HealthSignal

---

6. EXACT MODEL (STRICT — DO NOT MODIFY)

WaterRisk = 0.4 * clarity + 0.3 * odor + 0.3 * color;

VectorRisk = 0.5 * mosquito + 0.5 * (stagnation ? 1 : 0);

Sanitation = 0.5 * garbage + 0.5 * drainage;

Exposure = 0.6 * population + 0.4 * (usage === "drinking" ? 1 : 0.5);

sigmoid(x) = 1 / (1 + Math.exp(-x));

Risk_rule =
  0.3 * WaterRisk +
  0.3 * VectorRisk +
  0.2 * Sanitation +
  0.2 * Exposure;

Risk_ml = sigmoid(
  2 * VectorRisk +
  1.5 * WaterRisk +
  1.2 * Sanitation
);

FinalRisk = 0.6 * Risk_rule + 0.4 * Risk_ml;

---

7. VALIDATION ENGINE

Detect inconsistencies:

- clear + strong odor
- no stagnation + many mosquitoes

Return:

confidence ∈ [0.5, 1]

---

8. FINAL OUTPUT

AdjustedRisk = FinalRisk × confidence

Return:

- risk score
- category
- confidence
- contributing factors

---

🔒 9. MERGED FILE CONTENT SPECIFICATION (MANDATORY)

---

🔹 models/riskEngine.ts

Must include:

- Feature Engineering
- Validation Engine
- Risk Model
- Simulation Engine
- Optimization Engine

// FEATURE ENGINEERING
export function computeFeatures() {}

// VALIDATION
export function computeConfidence() {}

// RISK MODEL
export function computeRisk() {}

// SIMULATION
export function simulateRisk() {}

// OPTIMIZATION
export function getRecommendations() {}

---

🔹 utils/index.ts

Must include:

- sigmoid
- clamp
- normalization
- formatting
- chart adapter
- logger

export const log = (...args) => {
  console.log("[APHIP]", ...args);
};

---

🔹 constants/index.ts

Must include:

- mappings
- thresholds
- labels

---

🔹 config/index.ts

Must include:

- colors
- spacing
- animation timings
- global config

---

🔹 components/ui/index.tsx

Must include:

- Card
- Button
- Slider
- Skeleton

---

🔹 data/scenarios.ts

Must include:

export const scenarios = {
  lowRisk: {...},
  mediumRisk: {...},
  highRisk: {...}
};

---

⚠️ NO FUNCTIONAL LOSS RULE

- Do NOT remove any logic
- Do NOT simplify model
- Maintain full system capability

---

10. UI LAYOUT (STRICT GRID)

Top:

- RiskGauge + ConfidenceBar

Middle:

- TrendChart + FactorBreakdown

Bottom:

- SimulationPanel + ActionPanel

Sidebar + Topbar required.

---

11. UI DESIGN SYSTEM

- Dark theme (#0f172a)
- Glassmorphism
- Rounded-2xl
- Gradient overlays
- Clean SaaS layout

---

12. COMPONENT REQUIREMENTS

- RiskGauge → animated radial
- TrendChart → animated line
- FactorBreakdown → bars
- SimulationPanel → sliders
- ActionPanel → ranked actions
- ConfidenceBar → animated

---

13. ANIMATION RULES

- Entry: 0.5s ease-out
- Risk gauge: 1s spring
- Hover: scale 1.05
- Chart: 0.6s
- Smooth updates

---

14. STATE MANAGEMENT

Use Context API + custom hook.

State:

- input
- features
- risk
- simulation

---

15. INTERACTION RULES

- Instant recompute
- Simulation overrides
- Real-time updates

---

16. OPTIMIZATION ENGINE

Rank actions:

1. Remove stagnation
2. Improve drainage
3. Issue alert

---

17. EDGE CASES

- All low → low risk
- All high → high risk
- Conflicts → lower confidence

---

18. UI PRIORITY RULE

- Max 6 components
- No clutter
- Clean layout

---

19. PERFORMANCE RULE

- Avoid re-renders
- Use memoization
- Smooth animations

---

20. CODE QUALITY RULE

- No logic in UI
- Modular code
- Clean separation

---

21. NUMERICAL STABILITY RULE

- Clamp all values to [0,1]
- Prevent overflow/underflow
- Ensure stable computations

---

22. FINAL REQUIREMENT

The app must:

- Look premium
- Be responsive
- Show intelligence
- Provide explainability
- Feel like a real product

---

23. STRICT RULES

DO NOT:

- Use basic forms
- Skip animations
- Use random values
- Break layout

---

FINAL UI CONSTRAINT

UI must match a clean SaaS dashboard:

- strict alignment
- consistent spacing
- minimal noise
- balanced layout

---

END — BUILD COMPLETE APPLICATION
