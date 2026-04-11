# {{SKILL_NAME}}

> {{One-line description of what this Skill does}}

## Quick Start

1. Read `SKILL.md` for an overview of the architecture
2. Check `references/business-spec.md` for business rules
3. Review `references/api-spec.md` for data source requirements

## Architecture

```
┌──────────────────────────────────────────────────┐
│                   L4 Rendering                    │
│  Hero Card → Chart/Table → Trust Layer            │
├──────────────────────────────────────────────────┤
│                   L3 Decision                     │
│  LLM → headline + reasoning + risk_warning        │
├──────────────────────────────────────────────────┤
│                   L2 Compute                      │
│  Filter → Enrich → Normalize → Score → Rank       │
├──────────────────────────────────────────────────┤
│                   L1 Data                          │
│  {{Source 1}} → {{Source 2}} → Unified Schema      │
└──────────────────────────────────────────────────┘
```

## File Index

| File | Purpose |
|------|---------|
| `SKILL.md` | Main control document (8 sections) |
| `references/business-spec.md` | Business rules and constraints |
| `references/api-spec.md` | API endpoints, fields, schemas |
| `references/backend-computation.md` | Scoring algorithms, formulas |
| `references/implementation-guide.md` | Frontend + AI integration guide |
| `references/ai-prompts.md` | LLM prompt specification |
| `references/viz-specs.md` | Visual design specifications |
| `references/prototype-notes.md` | Demo vs production differences |
| `references/TestSuite.md` | Test cases and checklists |
| `references/SKILL-REVIEW.md` | Gap analysis template |
| `templates/ai-input.json` | Sample AI input |
| `templates/ai-output.json` | Sample AI output |
| `scripts/validate-ai-output.js` | Output validation script |
| `frontend/{{SKILL_SLUG}}.html` | Hi-Fi demo (visual reference) |

## TODO for Tech Team

See `references/implementation-guide.md` § Production Checklist for the prioritized list of tasks.

## License

Proprietary — Antseer.ai
