# SeerClaw Smart Money Scanner Business Spec

## 1. Product Structure

Scanner 回答的问题：**现在大佬们在做什么方向？**

布局固定为：
- 左侧参数面板 `260px`
- 右侧结构化报告 `flex:1, max-width≈900px`

输入：
- `coin`
- `timeWindow`
- `开始分析`

输出只包含 5 个模块：
- S1 HeadlineCard
- S2 StatsGrid
- S3 SmartMoneyChart
- S4 AddressList
- S5 ConsensusCard

## 2. Input and Billing Rules

### Scanner
- `coin`: `BTC | ETH | SOL | DOGE | WIF`
- `timeWindow`: `30m | 1h | 4h | 24h`
- 切换按钮不自动触发请求，必须点 `开始分析`
- 1 次 scan = 1 个 coin × 1 个 timeWindow
- Scanner 不支持“全币种扫描”

### Validation
- 输入来自按钮组，不需要 freeform 校验
- 无匹配地址时要显示空态，而不是空白页

## 3. Responsibility Split

- **Backend**：所有数值与规则，包括 `summary`、`addresses`、`markers`、`candles`、`tier`
- **AI**：`description`、`nicknames`、`consensus`
- **Frontend**：格式化展示、组件顺序、hover/click、K 线重映射、HyperbotLink 行为

> 说明：旧原型里某些等级映射可能在前端做过 sample fallback；生产实现以 **后端计算** 为准。

## 4. Output Reading Order

- **3 秒**：看方向（多 / 空 / 分歧）
- **10 秒**：选人（决定点谁进入 Analyzer）
- **30 秒**：读共识与风险，决定是否进一步跟踪

## 5. Scanner Component Contract

### S1 HeadlineCard
- 标题必须是模板：`🐋 {longCount}个聪明钱做多、{shortCount}个做空——{方向判断} {coin}`
- `方向判断`：
  - `longPct >= 60` → 共识偏向做多
  - `longPct <= 40` → 共识偏向做空
  - 否则 → 多空分歧
- 描述 `description` 由 AI 提供
- **S1 description 只说发现了什么，不给建议**

### S2 StatsGrid
- 三列：
  - 多头占比
  - 多头净仓位
  - 最高胜率 + `topNick`
- `topWinRate` 取 `addresses[0].winRate`
- `topNick` 依赖 AI 昵称；AI 未返回时先用 skeleton / 地址缩写占位

### S3 SmartMoneyChart
- 高度约 `320px`
- Scanner 图表 **锁定当前扫描币种**
- **不显示切币器**
- 只允许切周期：`1m / 5m / 15m / 1h / 4h / 1D`
- markers 取每个地址在当前 coin 上最有代表性的持仓入场点

### S4 AddressList
- `addresses[]` 按 `winRate desc` 排序
- 每张卡必须展示：
  - Avatar(hash→SVG)
  - AI 昵称
  - 地址 HyperbotLink
  - tier / winRate badge
  - 方向 + 杠杆 pill
  - 仓位
  - 未实现盈亏
  - WL × 10
  - `pnl7d`
  - `profitRatio`
  - hover 提示：`点击分析→`
- 外链点击不能触发 Analyzer 跳转

### S5 ConsensusCard
- 顶部：多空比例条
- 下方：AI `consensus`
- `consensus` 必须包含：
  1. 多空定性
  2. 关键人物（昵称）
  3. 价位区间
  4. 少数派风险
  5. 可操作建议

## 6. Marker and Chart Behavior

### Scanner
- chart 切周期时调用 `GET /api/chart?coin=X&interval=Y`
- 如果接口未返回 markers，则复用已有 markers 重新映射到新蜡烛
- LONG marker 在 candle low 下方
- SHORT marker 在 candle high 上方
- 多 marker 同一蜡烛时要做垂直堆叠

### Scanner → Analyzer handoff
- 点击地址卡：
  - 切到 Analyzer
  - 填入地址
  - 自动执行分析
- 这是新的计费事件，不复用 Scanner 结果

## 7. Error Handling

- `404 NO_ADDRESSES`：`当前无满足条件的聪明钱地址，可尝试放宽时间窗口`
- `502 UPSTREAM_ERROR`：`数据源暂时不可用，请稍后重试`
- AI 失败：数值先渲染，文字回退安全占位

## 8. Quality Standards For AI Text

### Scanner copy
- `description`：20-60 字，客观摘要，不给建议
- `nicknames`：2-3 字中文，不可重复，要有风格感
- `consensus`：3-5 句，必须含方向 / 人物 / 价位 / 风险 / 建议

## 9. Required Footer

```text
数据源 Hyperliquid API
⚠ 不构成投资建议
```

## Retry Interaction Contract

- 上游异常或无结果空态都要使用 **错误卡 / 提示卡 + retry button** 的组合
- retry button 的行为是：保留当前输入参数，重新执行当前 skill
