---
name: seerclaw-smart-money-analyzer
description: "SeerClaw smart money Analyzer implementation skill. Use when building, modifying, debugging, reviewing, or packaging the 聪明钱 analyzer / wallet analyzer flow: address input, wallet profile, radar score, follow difficulty/grade, current positions, trade history, per-coin chart switching, AI narrative generation, or copy-trading evaluation UI/API work."
---

# SeerClaw Smart Money Analyzer Skill

## Scope

只处理 **Analyzer** 这一条链路：
- 地址输入与预设地址入口
- `/api/address/analyze` 联调
- HeroCard、Radar、持仓表、FollowAdvice、数据佐证区
- Analyzer K 线、切币、切周期、marker 补全
- Analyzer 专属 AI 文案：`nickname`、`narrative`、`followAdvice`

如果用户要做按币和时间窗扫描地址、Scanner 共识区或 Scanner 地址卡列表，请切到 Scanner skill。

## Package Contents

- `references/business-spec.md`：Analyzer 业务规则与 11 个组件契约
- `references/implementation-guide.md`：Analyzer 实现细节、规则映射、图表切换规则
- `references/api-spec.md`：Analyzer 接口与共享市场接口
- `references/ai-prompts.md`：Analyzer prompt、输出 schema、retry 规则
- `references/viz-specs.md`：Analyzer 用到的可视化规范
- `references/TestSuite.md`：Analyzer 测试清单
- `references/SKILL-REVIEW.md`：Analyzer 输出质量 review
- `templates/analyzer-ai-input.json` / `templates/analyzer-ai-output.json`：AI 输入输出样例
- `scripts/validate-ai-output.js`：Analyzer AI 输出结构校验

## Workflow

1. 先确认输入是否属于 Analyzer：地址、预设地址，或者 Scanner 卡片跳转。
2. 读 `references/business-spec.md`，锁定 11 个组件和条件渲染规则。
3. 读 `references/api-spec.md`，接 `/api/address/analyze` 与图表切币 / 切周期接口。
4. 读 `references/ai-prompts.md`，生成昵称、叙事和跟单建议。
5. 读 `references/viz-specs.md`，实现 Radar、PnL 图、分布图、热力图、K 线 marker。
6. 如果要验结构，跑：`node scripts/validate-ai-output.js templates/analyzer-ai-output.json`。

## Input Contract

```text
address: 0x...
validation: /^0x[a-fA-F0-9]{8,}$/
trigger: user clicks “开始分析” or enters from Scanner card
```

规则：
- 1 次 analysis = 1 个地址。
- 输出覆盖这个地址的全部相关币种。
- 地址非法时按钮必须禁用，不要把错误留给后端兜底。

## Implementation Checklist

### API
- 主请求：`POST /api/address/analyze`
- 图表切币 / 切周期：`GET /api/chart?coin=X&interval=Y&address=Z`
- 市场辅助：`/market/candles`、`/market/ticker`、`/market/coins`

### Data
- `candles` 是按 coin 分桶的对象：`{ BTC: [...], ETH: [...] }`。
- `followDifficulty`、`followGrade`、`tier` 都是前端映射，不是后端原始字段。
- marker 里的 `lev`、`wr`、`pr`、`res` 可能缺；popover 需要用 profile/account/recentResults 回填。
- `profitRatio === null`、`recent7dWinRate === null` 都属于合法空值。

### AI
- 只生成 3 个核心字段：`nickname`、`narrative`、`followAdvice`。
- `followDifficulty` 和 `followGrade` 先由前端算，再喂给 AI 复述。
- `_selfScore.score < 70` 时重试，最多 3 次。

### Rendering Order
1. A1 HeroCard
2. A2 PositionsTable
3. A3 FollowAdviceCard
4. A4 Divider
5. A5~A9 数据佐证区
6. A10 SmartMoneyChart
7. A11 TradesTable

### Error Handling
- `404 NO_TRADES`：提示过去 30 天无交易记录。
- Trades < 10：正常渲染，但加“数据样本量有限”。
- AI parse 失败：回退到安全占位文案，不阻塞数值渲染。

## Chart Rules

- 默认 coin = `preferredPairs[0]`，不要硬编码 BTC。
- 切 coin 时必须过滤 marker，只显示当前 coin 的交易。
- 切周期时要重新请求 `/api/chart`，并替换为新返回的 candles / markers。

## Footer

侧边栏底部固定：

```text
数据源 Hyperliquid API
⚠ 不构成投资建议
```
