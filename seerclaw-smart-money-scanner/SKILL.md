---
name: seerclaw-smart-money-scanner
description: "SeerClaw smart money Scanner implementation skill. Use when building, modifying, debugging, reviewing, or packaging the Scanner flow for 聪明钱 / smart money dashboards: coin + time-window input, smart-money scan results, address cards, consensus copy, K-line markers, Scanner-to-Analyzer handoff, or Hyperliquid smart money scanning UI/API work."
---

# SeerClaw Smart Money Scanner Skill

## Scope

只处理 **Scanner** 链路：
- 左侧参数：单币种 + 时间窗口
- `POST /api/smart-money/scan`
- S1~S5 五个输出模块
- Scanner K 线 / marker / popover
- Scanner → Analyzer 自动跳转
- Scanner AI 文案：`description` / `nicknames` / `consensus`

如果任务是地址画像、Radar、跟单建议、持仓表、交易明细，切到 Analyzer skill。

## Source of Truth Order

**Package precedence:** PRD 里的内联示例如果比 package refs 更薄，实施时以本 skill 包内的 references 组合契约为准。


1. `references/business-spec.md` — 产品与渲染契约
2. `references/backend-computation.md` — 后端发现 / 计算 / 聚合逻辑
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
- `references/TestSuite.md`
- `references/SKILL-REVIEW.md`
- `templates/scanner-ai-input.json`
- `templates/scanner-ai-output.json`
- `scripts/validate-ai-output.js`

## Workflow

1. 先确认需求属于 Scanner，而不是 Analyzer。
2. 先读 `references/business-spec.md`，锁定 S1~S5 契约。
3. 需要后端或数据字段时读 `references/backend-computation.md` 和 `references/api-spec.md`。
4. 需要状态机、交互、页面行为时读 `references/implementation-guide.md`。
5. 需要文案规则时读 `references/ai-prompts.md`。
6. 需要图表 / marker / popover / ratio bar 时读 `references/viz-specs.md`。
7. 需要与 HTML 原型保持一致时读 `references/prototype-notes.md`。
8. 交付前按 `references/TestSuite.md` 过一遍。

## Input Contract

```text
coin: BTC | ETH | SOL | DOGE | WIF
timeWindow: 30m | 1h | 4h | 24h
trigger: user clicks “开始分析”
```

规则：
- 每次只扫描一个币种。
- 切换 coin / timeWindow 不自动执行。
- 1 次 scan = 1 个 coin × 1 个 timeWindow。
- 点击地址卡进入 Analyzer = 新计费事件。

## Non-negotiable Rules

- **生产口径以 PRD 为准**：所有数值、等级、雷达、建议仓位都由后端计算。
- **前端只做格式化与渲染**；只有在纯原型模式下才允许本地 mock / fallback。
- **S1 description 只做客观摘要**，不给建议。
- **S5 consensus 必须带价位区间、少数派风险、可操作建议。**
- **Scanner 图表不允许切币，只允许切周期。**

## Implementation Checklist

### Backend
- 地址发现机制可工作
- 扫描结果已按 `winRate desc` 排序
- marker 基于当前 coin 的主仓位入场点
- `summary/addresses/markers/candles/ai` 字段齐全

### Frontend
- 左侧 260px 参数面板
- S1~S5 顺序正确
- card hover / click 行为正确
- `HyperbotLink` 不触发卡片跳转
- LoadingState 至少 1.6s

### AI
- `description`：客观摘要
- `nicknames`：2-3 字中文且不可重复
- `consensus`：方向 + 人物 + 价位 + 风险 + 建议
- `_selfScore < 70` 时重试

### Validation
```bash
node scripts/validate-ai-output.js templates/scanner-ai-output.json
```

## Footer

```text
数据源 Hyperliquid API
⚠ 不构成投资建议
```
