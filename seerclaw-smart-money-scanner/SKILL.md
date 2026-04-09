---
name: seerclaw-smart-money-scanner
description: "SeerClaw smart money Scanner implementation skill. Use when building, modifying, debugging, reviewing, or packaging the Scanner flow for 聪明钱 / smart money dashboards: coin + time-window input, smart-money scan results, address cards, consensus copy, K-line markers, Scanner-to-Analyzer handoff, or Hyperliquid smart money scanning UI/API work."
---

# SeerClaw Smart Money Scanner Skill

## Scope

只处理 **Scanner** 这一条链路：
- 币种 + 时间窗选择
- `/api/smart-money/scan` 联调
- 扫描结果标题、统计卡、地址列表、共识区
- Scanner K 线和 marker
- 点击地址卡跳到 Analyzer 的交互契约
- Scanner 专属 AI 文案：`description`、`nicknames`、`consensus`

如果用户要做地址画像、Radar、持仓表、FollowAdvice，请切到 Analyzer skill。

## Package Contents

- `references/business-spec.md`：Scanner 业务规则与组件契约
- `references/implementation-guide.md`：Scanner 实现细节、数据转换、加载态与图表规则
- `references/api-spec.md`：Scanner 接口与共享市场接口
- `references/ai-prompts.md`：Scanner prompt、输出 schema、retry 规则
- `references/viz-specs.md`：Scanner 用到的可视化规范
- `references/TestSuite.md`：Scanner 测试清单
- `references/SKILL-REVIEW.md`：Scanner 输出质量 review
- `templates/scanner-ai-input.json` / `templates/scanner-ai-output.json`：AI 输入输出样例
- `scripts/validate-ai-output.js`：Scanner AI 输出结构校验

## Workflow

1. 先确认输入是否属于 Scanner：`coin` + `timeWindow` + “开始分析”。
2. 读 `references/business-spec.md`，锁定页面顺序和交互边界。
3. 读 `references/api-spec.md`，接 `/api/smart-money/scan` 与图表切周期接口。
4. 读 `references/ai-prompts.md`，生成 Scanner 的说明文案、昵称和共识文本。
5. 读 `references/viz-specs.md`，实现地址卡里的 WL blocks、Long/Short 比例条和 K 线 marker。
6. 如果要验结构，跑：`node scripts/validate-ai-output.js templates/scanner-ai-output.json`。

## Input Contract

```text
coin: BTC | ETH | SOL | DOGE | WIF
timeWindow: 30m | 1h | 4h | 24h
trigger: user clicks “开始分析”
```

规则：
- 切换 coin 不自动发请求。
- 1 次 scan = 1 个 coin × 1 个 timeWindow。
- 地址卡点击后要把地址带给 Analyzer，并触发新的计费事件。

## Implementation Checklist

### API
- 主请求：`POST /api/smart-money/scan`
- 图表切周期：`GET /api/chart?coin=X&interval=Y`
- 市场辅助：`/market/candles`、`/market/ticker`、`/market/coins`

### Data
- `candles[]` 是 Hyperliquid 风格，OHLCV 都是字符串，必须先 parse。
- `addresses[]` 已按 `winRate desc` 排序，最高胜率直接取 `addresses[0]`。
- `markers[]` 里的 `tier` 由前端根据 `winRate` 映射，不是后端直接给。
- 数字格式统一用 `$1.4M / $42K / —`。

### AI
- 只生成 3 个字段：`description`、`nicknames`、`consensus`。
- `topNick` 依赖 AI 昵称；AI 未返回前，S2 先显示占位。
- `_selfScore.score < 70` 时重试，最多 3 次。

### Rendering Order
1. S1 HeadlineCard
2. S2 StatsGrid
3. S3 SmartMoneyChart
4. S4 AddressList
5. S5 ConsensusCard

### Error Handling
- `404 NO_ADDRESSES`：提示当前无满足条件地址。
- `502 UPSTREAM_ERROR`：提示数据源暂时不可用并给 retry。
- AI parse 失败：安全回退到占位文案，不阻塞数值渲染。

## Cross-Skill Handoff

点击 Scanner 地址卡时，必须保留这个契约：

```javascript
setActiveSkill('analyzer');
setAnalyzerAddress(address);
setIsRunning(true);
```

这不是本 skill 去实现 Analyzer 页面，而是保证 Scanner 输出能无缝跳过去。

## Footer

侧边栏底部固定：

```text
数据源 Hyperliquid API
⚠ 不构成投资建议
```
