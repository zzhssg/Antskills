---
name: dualyield
description: "Dual-yield / dual investment strategist for comparing CEX dual-currency products, ranking strike-duration combinations by APR and touch probability, and producing a shareable PM→engineering handoff package. Use when evaluating 双币投 / dual investment / DCI / sharkfin style products, choosing strike levels, comparing Binance/OKX/Bybit/Bitget/KuCoin style offerings, or handing a dual-yield product workflow to engineering for implementation."
compatibility: filesystem, python3
---

# DualYield Strategist Skill

## Status

这是一个 **产品定义很完整、工程接线未完成的 handoff skill 包**。

适合：
- 产品经理把双币投产品逻辑、评分方法、前端原型交给工程
- 工程同事基于现有 L2/L3 和前端原型继续补数据接入与真实渲染

不适合直接当作：
- 已完成全部 API 联调的生产 skill
- 已经可以直接上线的双币投成品工具

## What is already strong

- L2 核心算法完成度高：到达概率、风险过滤、评分、排序、异常检测
- L3 模板结论已完成，不依赖 LLM 也能产出稳定结论
- `frontend/dualyield.html` 是完整高保真前端原型
- PRD、技术待办、技术 onboarding 文档齐全
- 单测通过：`32/32`

## What engineering still needs to finish

优先读：`TODO-TECH.md`

高优先缺口：
- Antseer DCI / 市场端点确认并接入
- Binance DCI 与公开市场数据接线
- 其他 CEX connector 补齐
- 前端 mock → orchestrator 输出注入
- 缓存与真实环境配置

## Package map

```text
dualyield/
├── SKILL.md
├── README.md / README.zh.md
├── VERSION
├── requirements.txt
├── .env.example
├── TODO-TECH.md
├── HANDOFF-REVIEW.md
├── docs/
├── agents/openai.yaml
├── assets/
├── data/
├── frontend/
├── pipeline/
└── tests/
```

## Pipeline 执行顺序

```text
Phase 0 用户参数 → L1 数据获取 → L2 计算评分 → L3 结论生成 → L4 渲染
```

## Suggested handoff reading order

1. `README.md`
2. `HANDOFF-REVIEW.md`
3. `TODO-TECH.md`
4. `docs/PRD.md`
5. `docs/TECH-ONBOARDING.md`
6. `pipeline/` 与 `frontend/dualyield.html`

## Quick commands

```bash
pip install -r requirements.txt
python -m unittest tests.test_l2 -v
python pipeline/orchestrator.py
```

## Notes for engineering

- `frontend/dualyield.html` 当前仍是 mock 驱动原型
- `pipeline/l2_compute/` 是当前最值得直接复用的部分
- `pipeline/l3_decision/decision.py` 默认使用模板结论，不阻塞首版上线
- `docs/TODO-TECH.md` 保留了更细的实施拆分，根目录 `TODO-TECH.md` 是分享用摘要版
