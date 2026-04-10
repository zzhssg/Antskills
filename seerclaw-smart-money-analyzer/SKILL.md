---
name: seerclaw-smart-money-analyzer
description: "SeerClaw smart money Analyzer implementation skill. Use when building, modifying, debugging, reviewing, or packaging the 聪明钱 analyzer / wallet analyzer flow: address input, wallet profile, radar score, follow difficulty/grade, current positions, trade history, per-coin chart switching, AI narrative generation, or copy-trading evaluation UI/API work."
---

# SeerClaw Smart Money Analyzer Skill

## Scope

只处理 **Analyzer** 链路：
- 地址输入 / paste / preset / 来自 Scanner 的自动带参
- `POST /api/address/analyze`
- A1~A11 全部模块
- Radar / FollowAdvice / 持仓表 / 数据佐证区 / TradesTable
- Analyzer K 线切币 / 切周期 / marker 过滤
- Analyzer AI 文案：`nickname` / `narrative` / `followAdvice`

如果任务是按币种和时间窗扫描地址、输出共识判断，切到 Scanner skill。

## Source of Truth Order

**Package precedence:** PRD 里的内联示例如果比 package refs 更薄，实施时以本 skill 包内的 references 组合契约为准。


1. `references/business-spec.md` — 产品与渲染契约
2. `references/backend-computation.md` — Round Trip 聚合、雷达、建议仓位、账户字段计算
3. `references/api-spec.md` — API 契约与字段说明
4. `references/implementation-guide.md` — 前端接线、状态机、交互细节
5. `references/ai-prompts.md` — AI prompt 与输出质量要求
6. `references/viz-specs.md` — 可视化像素级细节
7. `references/prototype-notes.md` — 与 `smart-money-tracker.html` 对齐时必须保留的隐性行为
8. `references/TestSuite.md` — 自测清单

## Package Contents

- `references/business-spec.md`
- `references/backend-computation.md`
- `references/api-spec.md`
- `references/implementation-guide.md`
- `references/ai-prompts.md`
- `references/viz-specs.md`
- `references/prototype-notes.md`
- `references/analyzer-hi-fi.html`
- `references/TestSuite.md`
- `references/SKILL-REVIEW.md`
- `templates/analyzer-ai-input.json`
- `templates/analyzer-ai-output.json`
- `scripts/validate-ai-output.js`

## Workflow

1. 先确认任务属于 Analyzer，而不是 Scanner。
2. 先读 `references/business-spec.md`，锁定 A1~A11 契约。
3. 需要后端或数据字段时读 `references/backend-computation.md` 和 `references/api-spec.md`。
4. 需要状态机、交互、页面行为时读 `references/implementation-guide.md`。
5. 需要人物叙事与建议时读 `references/ai-prompts.md`。
6. 需要 Radar / heatmap / chart / distribution 时读 `references/viz-specs.md`。
7. 需要与 HTML 原型保持一致时读 `references/prototype-notes.md`。
8. 交付前按 `references/TestSuite.md` 过一遍。

## Input Contract

```text
address: 0x...
validation: /^0x[a-fA-F0-9]{8,}$/
trigger: user clicks “开始分析” or enters from Scanner card
```

规则：
- 1 次 analysis = 1 个地址。
- 输出覆盖该地址全部币种，不按币种拆分收费。
- 地址非法时按钮必须禁用。
- Scanner 卡片点击进入时必须自动执行，不让用户再按一次按钮。

## Non-negotiable Rules

- **生产口径以 PRD 为准**：tier / followDifficulty / radarGrade / suggestedSize / radar 6 维均由后端计算。
- **前端只做渲染与格式化**；本地 fallback 只用于纯原型模式。
- **A9 的 KV 不要和 Hero 6 指标重复。**
- **A10 默认 coin = `preferredPairs[0]`。**
- **A11 行 hover 要能与图表联动。**
- **A2 footer 必须同时显示 account value / margin usage / available balance。**

## Implementation Checklist

### Backend
- Round Trip 聚合正确
- profile/account/radar/distributions/trades/markers/candles 齐全
- `followDifficulty/radarGrade/suggestedSize/ai` 字段齐全
- `markers[].coin` 存在，用于切币过滤

### Frontend
- 左侧输入 / preset / 自动带参可用
- A1~A11 顺序正确
- 无持仓空态、少样本提示、空值兜底正确
- 切币 / 切周期 / 翻页 / row-hover 联动正确
- LoadingState 至少 1.6s

### AI
- `nickname`：2-3 字中文
- `narrative`：3 段式人物故事
- `followAdvice`：3-5 句，含时机与注意事项
- `followDifficulty/followGrade` 优先回显后端输入
- `_selfScore < 70` 时重试

### Validation
```bash
node scripts/validate-ai-output.js templates/analyzer-ai-output.json
```

## Footer

```text
数据源 Hyperliquid API
⚠ 不构成投资建议
```
