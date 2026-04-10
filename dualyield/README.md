# DualYield

Dual-investment strike selector for comparing CEX dual-currency products and recommending high-yield, lower-touch-probability setups.

> **Status: PM-spec / engineering handoff package**
>
> This is intentionally **not a production-complete integration**. It is a shareable package for engineering teammates to continue from an already-defined product spec, scoring engine, frontend prototype, and technical TODO list.

## What it contains

- 4-stage pipeline (`L1 → L2 → L3 → L4`)
- product and technical documentation
- high-fidelity frontend prototype
- L2 quantitative scoring engine
- L3 template-based conclusion generator
- platform metadata
- technical onboarding and TODO docs

## Current completion summary

### Strong already
- L2 scoring logic is solid and test-covered
- L3 template mode works without needing an LLM
- frontend prototype communicates the full intended UX
- PRD and technical handoff docs are already detailed
- tests currently pass (`32/32`)

### Still incomplete
- Antseer DCI and market API contracts are unresolved
- Binance data connector is scaffolded but not wired
- most non-Binance CEX connectors are still stubs
- frontend still renders mock data
- cache / real environment wiring is unfinished

## Read this first

1. `HANDOFF-REVIEW.md`
2. `TODO-TECH.md`
3. `docs/PRD.md`
4. `docs/TECH-ONBOARDING.md`

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m unittest tests.test_l2 -v
python pipeline/orchestrator.py
```

## Folder overview

```text
dualyield/
├── SKILL.md
├── README.md
├── README.zh.md
├── HANDOFF-REVIEW.md
├── TODO-TECH.md
├── docs/
├── pipeline/
├── frontend/
├── data/
└── tests/
```

## Sharing intent

This package is meant to be shared with engineering teammates so they can:
- reuse the probability / ranking logic
- understand the intended product UX quickly
- see exactly what is still missing
- continue implementation without re-deriving the product logic
