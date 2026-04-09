# SeerClaw Smart Money Analyzer Business Spec

## 1. Product Structure

Analyzer 回答的问题：**这个地址值不值得跟？**

布局固定为：
- 左侧参数面板 `260px`
- 右侧结构化报告 `flex:1, max-width≈900px`

输入：
- 地址输入框
- preset 地址列表
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
- 输出覆盖该地址全部币种
- Scanner 卡片跳转 = 新计费事件

### Validation
```javascript
const isValidAddress = (addr) => /^0x[a-fA-F0-9]{8,}$/.test(addr);
```
- 非法地址时按钮禁用
- preset 点击后可直接执行

## 3. Responsibility Split

- **Backend**：profile、positions、account、radar、radarGrade、followDifficulty、suggestedSize、distributions、trades、markers、candles
- **AI**：nickname、narrative、followAdvice
- **Frontend**：格式化、条件渲染、marker 补全、切币过滤、hover 联动

> 说明：旧原型里某些 badge 可能由前端硬编码 sample 值；生产实现以 **后端返回** 为准。

## 4. Output Reading Order

- **3 秒**：看人设、Radar、整体等级
- **10 秒**：看当前持仓、难度、建议仓位
- **30 秒**：看分布、活跃时段、交易明细

## 5. Analyzer Component Contract

### A1 HeroCard
左侧：
- Avatar
- AI 昵称
- tier badge
- HyperbotLink
- 6 指标横排：胜率 / 30D / 盈亏比 / MDD / 总笔数 / 均持仓
- AI narrative（三段）

右侧：
- RadarChart(280px)
- `AI 综合评估` 标签

### A2 PositionsTable
- 多仓位表格列：币种 / 方向 / 杠杆 / 入场价 / 仓位 / 盈亏 / 盈亏% / 清算价
- header：脉动绿点 + `当前持仓` + 仓位数 + 总未实现盈亏
- footer：`account value + margin usage + available balance`
- 无持仓时显示 `当前无持仓`
- `marginPct > 80` 时进度条变黄

### A3 FollowAdviceCard
- 标题：`📍跟单建议`
- pill：`followDifficulty` + `followGrade`
- AI `followAdvice`
- `suggestedSize`
- 建议文本必须讲原因 / 当前时机 / 注意事项

### A4 Divider
- 固定文案：`──── 数据佐证 ────`

### A5 ~ A9 Data Proof
- A5：30 天日收益柱
- A6：30 天累计收益曲线
- A7：收益分布 + 底部 `avgWin/avgLoss/maxWin/maxLoss`
- A8：持仓时长分布
- A9：不与 Hero 重复的 KV + UTC 活跃时段热力图

### A10 SmartMoneyChart
- 高度约 `340px`
- 默认 coin = `preferredPairs[0]`
- 可切 `preferredPairs`
- 可切周期：`1m / 5m / 15m / 1h / 4h / 1D`
- markers 必须按当前 coin 过滤

### A11 TradesTable
- 筛选：`ALL / BTC / ETH / SOL`
- 每页 10 条
- 列：`# / time / coin / dir / lev / entry / exit / pnl / pnl% / hold / W/L`
- row hover：高亮 + 与图表联动

## 6. Conditional Rendering Rules

- `positions.length === 0` → A2 空态
- `totalTrades < 10` → narrative / UI 提示 `数据样本量有限`
- `profitRatio === null` → `∞` 或 `—`
- `recent7dWinRate === null` → `—`
- `avgLeverage === null` → `—`
- marker `lev === null` → popover 隐藏或显示 `—`

## 7. Marker and Chart Behavior

### Analyzer
- 切周期：`GET /api/chart?coin=X&interval=Y&address=Z`
- 切币：`GET /api/chart?coin=NEW&interval=Y&address=Z`
- 用新返回的 candles + markers 替换图表
- marker popover 需要补 `nick/tier/wr/pr/res`
- TradesTable row hover 要能高亮对应交易 / marker

## 8. Error Handling

- `404 NO_TRADES`：`该地址在过去30天内无交易记录`
- `502 UPSTREAM_ERROR`：`数据源暂时不可用，请稍后重试`
- `400 INVALID_ADDRESS`：前端先禁用按钮，避免把错误留给后端
- AI 失败：保留数值渲染，文字回退安全占位

## 9. Quality Standards For AI Text

### Analyzer copy
- `nickname`：2-3 字，像人物标签
- `narrative`：3 段式，先画像再翻译数字再讲现状
- `followAdvice`：3-5 句，含难度原因 / 操作建议 / 当前时机 / 注意事项

## 10. Required Footer

```text
数据源 Hyperliquid API
⚠ 不构成投资建议
```

## Retry Interaction Contract

- 上游异常或无结果空态都要使用 **错误卡 / 提示卡 + retry button** 的组合
- retry button 的行为是：保留当前输入参数，重新执行当前 skill
