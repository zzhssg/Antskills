# SeerClaw Smart Money Analyzer Skill Review

## 第一类：数据绑定问题

### Analyzer profile/account/radar 接入情况
- HeroCard 必须同时拿到 `profile`、`radar`、`radarScore`、`recentResults`。
- FollowAdviceCard 必须同时拿到 `suggestedSize`、`followDifficulty`、`followGrade`。
- `positions`、`dailyPnl`、`curve`、`profitDist`、`holdDist`、`hours`、`trades` 任何一个缺失，页面都不应静默吞掉。

### 字段说明
- `profitRatio === null` 表示最近窗口没有亏损单，前端要显示 `∞` 或 `—`，不能显示 `0`。
- `recent7dWinRate === null`、`avgLeverage === null`、marker 里的 `lev === null` 都属于合法空值。
- `candles` 是按 coin 分桶的对象，而不是数组。

## 第二类：前端组件问题

### Analyzer 11 个组件的完整性
- A1 HeroCard：头像、昵称、6项关键指标、AI narrative、RadarChart。
- A2 PositionsTable：多仓位表格 / 空态提示。
- A3 FollowAdviceCard：难度、评级、建议文本、建议仓位。
- A4 Divider：`──── 数据佐证 ────`。
- A5~A9：日收益柱、累计曲线、收益分布、持仓时长、分析面板。
- A10 SmartMoneyChart：默认 `preferredPairs[0]`，可切币、可切周期。
- A11 TradesTable：筛选、分页、W/L 与持仓时长列。

### 逐项说明
- FollowDifficulty 必须由前端规则映射得出，AI 只复述，不重新判断。
- Marker popover 要补齐 `nick/tier/wr/pr/res`，不能直接裸用 marker 原始字段。
- Analyzer 图表切币时，必须按当前 coin 过滤 marker。

## 第三类：AI 输出质量问题

### 叙事与建议
- narrative 先写风格判断，再翻译关键数字，最后给出可跟/不可跟的边界。
- followAdvice 要给出条件与风险，不要只说“可以关注”。
- 禁止写成数据清单或报告口吻。

## 附录

### 验证建议
- 用 `node scripts/validate-ai-output.js templates/analyzer-ai-output.json` 检查结构。
- 至少手测一次：地址输入 → 加载态 → HeroCard → 图表切币 → TradesTable 分页。
