# Antskills

Curated skills for AntSeer / SeerClaw workflows.

## Included skills

### 1. `seerclaw-smart-money-scanner`
Build and maintain the Scanner side of the SeerClaw smart money product:
- coin + time-window scan flow
- address cards
- consensus AI copy
- chart markers
- Scanner → Analyzer handoff

### 2. `seerclaw-smart-money-analyzer`
Build and maintain the Analyzer side of the SeerClaw smart money product:
- wallet profile and radar
- follow advice
- positions and trade history
- per-coin chart analysis
- wallet evaluation UI

### 3. `yield-desk`
Stablecoin yield decision desk for comparing CEX and DeFi earn products.

> Status: **PM-spec / engineering handoff package**
>
> This package is intentionally **not production-complete**. It is meant to help engineering teammates continue from an already-defined product spec, high-fidelity prototype, L2 scoring logic, and explicit TODO list.

What is already strong:
- clear 4-layer pipeline (`L1 → L2 → L3 → L4`)
- solid L2 scoring foundation
- high-fidelity frontend prototype
- useful platform / protocol metadata
- L2 tests passing (`16/16`)

What still needs engineering work:
- Antseer API contract confirmation
- non-Binance CEX connector implementation
- L3 env / key / deployment wiring
- frontend mock → real data injection
- fuller L1 / E2E reliability coverage

### 4. `dualyield`
Dual-investment strike selector for comparing CEX dual-currency products.

> Status: **PM-spec / engineering handoff package**
>
> This package is intentionally **not production-complete**. It is meant to help engineering teammates continue from an already-defined PRD, L2 scoring engine, L3 template conclusion logic, and high-fidelity frontend prototype.

What is already strong:
- strong L2 probability / ranking engine
- L3 template-based conclusion generator
- detailed PRD and technical onboarding docs
- high-fidelity frontend prototype
- tests passing (`32/32`)

What still needs engineering work:
- Antseer DCI / market endpoint confirmation
- Binance and other CEX connector implementation
- frontend mock → real data injection
- cache and runtime env wiring

## Layout

Each skill is a standalone package. Most packages include:
- `SKILL.md`
- `README.md` / `README.zh.md`
- `agents/openai.yaml`
- `assets/`
- optional `references/`, `scripts/`, `templates/`, `docs/`, `tests/`
- `VERSION`


### 5. `antskill-creator`
Spec-first operating system for designing, prototyping, specifying, packaging, reviewing, and publishing standalone skills.

> Status: **production-ready package**
>
> Unlike a generic skill factory, this package ships a full creation system: paradigm selection, stage-gated workflow, 4-layer architecture discipline, source-of-truth arbitration, quality gates, reusable templates, and real case-study packages.

What is already strong:
- 3 paradigms (`A / B / C`) for implementation-first, spec-first, and dual-mode outputs
- 6-stage workflow (`S1 → S6`) with explicit quality gates
- 4-layer runtime architecture (`L1 → L4`)
- 9 reference document templates and reusable packaging assets
- 4 example packages, including tested DualYield (`32/32`) and Yield Desk (`16/16`)

What makes it different:
- not just prompt scaffolding
- enforces methodology and source-of-truth discipline
- designed for GitHub-shareable, engineer-friendly skill packages
