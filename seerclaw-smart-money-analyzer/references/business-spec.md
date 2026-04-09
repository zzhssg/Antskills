# SeerClaw Smart Money Analyzer Business Spec

## 1. Product Structure

Analyzer 回答的问题是：**这个地址值不值得跟？**

输入来自左侧栏：
- 地址输入框
- 预设地址列表
- 来自 Scanner 的自动跳转

输出包含 11 个模块：
- A1 HeroCard
- A2 PositionsTable
- A3 FollowAdviceCard
- A4 Divider
- A5 DailyBarsChart
- A6 CumulativeChart
- A7 ProfitDistChart
- A8 HoldDistBars
- A9 AnalysisPanel
- A10 SmartMoneyChart
- A11 TradesTable

## 2. Input and Billing Rules

### Analyzer
- 1 次 analysis = 1 个地址
- 输出覆盖这个地址的全部相关币种
- 支持从 Scanner 卡片自动带地址进入

### Validation
```javascript
const isValidAddress = (addr) => /^0x[a-fA-F0-9]{8,}$/.test(addr);
```
- 非法地址时按钮禁用
- 预设地址点击后可直接执行

## 3. Responsibility Split

- **Backend**：profile、positions、account、radar、distributions、trades、markers、candles
- **AI**：nickname、narrative、followAdvice
- **Frontend**：followDifficulty、followGrade、tier、格式化、条件渲染、marker 补全、图表切币过滤

## 4. Frontend Rule Mappings

### Follow difficulty
```javascript
function getFollowDifficulty(avgHold, winRate, avgLev) {
  if (avgHold < 30 || avgLev > 5) return '较高';
  if (avgHold > 120 && winRate > 75) return '较低';
  return '中等';
}
```

### Radar grade
```javascript
function getRadarGrade(score) {
  if (score >= 85) return 'S';
  if (score >= 75) return 'A+';
  if (score >= 65) return 'A';
  if (score >= 55) return 'B+';
  if (score >= 45) return 'B';
  return 'C';
}
```

### Tier mapping
Analyzer marker/popover 里的 tier 仍然来自 `profile.winRate` 映射。

## 5. Output Reading Order

- **3 秒**：看这个人是谁、风格如何、雷达分多少
- **10 秒**：看当前持仓、建议仓位、跟单难度
- **30 秒**：看收益分布、活跃时段、交易明细

## 6. Analyzer Component Contract

### A1 HeroCard
- 左侧：头像、昵称、6 项关键指标、AI narrative
- 右侧：RadarChart（280px）

### A2 PositionsTable
- 展示当前仓位；无持仓时显示灰态空文案
- `marginPct > 80` 时条形图转黄

### A3 FollowAdviceCard
- 显示 `followDifficulty`、`followGrade`、AI followAdvice、suggestedSize
- 建议文本必须给出条件和边界

### A4 Divider
- 固定文案：`──── 数据佐证 ────`

### A5 ~ A9 Data Proof
- A5：30 天日收益柱
- A6：30 天累计曲线
- A7：收益分布
- A8：持仓时长分布
- A9：分析面板 + 活跃时段热力条

### A10 SmartMoneyChart
- 高度约 340px
- 默认 coin = `preferredPairs[0]`
- 支持切 coin 与切周期
- marker 必须按当前 coin 过滤

### A11 TradesTable
- 支持 `ALL/BTC/ETH/SOL` 筛选
- 每页 10 条
- 列：time / coin / dir / lev / entry / exit / pnl / pnl% / hold / W/L

## 7. Conditional Rendering Rules

- `positions.length === 0`：隐藏表格，显示 `当前无持仓`
- `totalTrades < 10`：补 `数据样本量有限`
- `profitRatio === null`：显示 `∞` 或 `—`
- `recent7dWinRate === null`：显示 `—`
- `avgLeverage === null`：显示 `—`
- marker `lev === null`：popover 隐藏或显示 `—`

## 8. Marker and Chart Behavior

### Analyzer
- 切周期：`GET /api/chart?coin=X&interval=Y&address=Z`
- 切币：`GET /api/chart?coin=NEW&interval=Y&address=Z`
- 用新返回的 candles + markers 替换当前图表数据
- marker popover 需要补 `nick/tier/wr/pr/res`

## 9. Error Handling

- `404 NO_TRADES`：`该地址在过去30天内无交易记录`
- `502 UPSTREAM_ERROR`：数据源暂时不可用
- AI 失败：保留数值部分，文案回退到安全占位

## 10. Quality Standards For AI Text

### Analyzer copy
- `nickname`：2-3 字，能看出交易风格
- `narrative`：先给风格判断，再翻译数字，再谈是否值得跟
- `followAdvice`：有条件、有风险边界，不能只给结论

## 11. Required Footer

```text
数据源 Hyperliquid API
⚠ 不构成投资建议
```
