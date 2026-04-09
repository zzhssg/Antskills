# SeerClaw Analyzer Visualization Specs Reference

## 1. Daily Bars

- 30 天日收益柱
- 正绿负红
- 零值日不画柱，但零线可见
- Y 轴对称：`+maxAbs / 0 / -maxAbs`
- X 轴：`1d / 10d / 20d / 30d`

## 2. Cumulative Curve

- `curve = prefix sum(dailyPnl)`
- 终点 >= 0 → 绿；< 0 → 红
- 线 + 面积填充
- 终点实心圆点
- 右上角显示总额

## 3. Profit Distribution

- 5 桶：`>100% / 50~100% / 0~50% / -50~0% / <-50%`
- 横条宽度 = `count / maxCount`
- 前 3 桶绿，后 2 桶红
- 底部 KV：`avgWin / avgLoss / maxWin / maxLoss`

## 4. Hold Duration Distribution

- 5 桶：`<15m / 15-30m / 30-60m / 1-2h / >2h`
- 每行：区间标签 + 进度条 + 百分比 + 笔数
- opacity = `0.15 + (percent/maxPercent) × 0.5`

## 5. Active Hours Heatmap

- 24 小时 UTC
- 24 个竖条
- opacity = `0.08 + (count/maxCount) × 0.55`
- hover title：`14:00 — 15笔`
- X 轴：`0 / 6 / 12 / 18 / 23`

## 6. Margin Usage Bar

- `marginPct = totalMargin / (totalMargin + availableMargin) × 100`
- <=80% 绿
- >80% 黄 `#f0b90b`

## 7. K-line Trade Markers

### Architecture Layers
- TradingView candlestick layer
- Native arrow markers
- DOM marker overlay
- hover popover

### Time Mapping
- `nearest candle` 映射
- 多 marker 同蜡烛时垂直堆叠

### Marker Dot Styles
- 22px avatar 圆点
- LONG：绿渐变
- SHORT：红渐变
- leverage mini badge

### Hover Popover
- 最小宽度 240px
- 字段：昵称 / tier / wr / dir / lev / entry / size / pnl / pnlPct / pr / ago / WL ×10

### Coin Filter Rule
- 只显示当前选中 coin 的 marker

## 8. Radar Chart

### Geometry
- 280×280 SVG
- 6 维 polygon
- 中心 grade + score

### Labels
- 左侧 end，右侧 start，上下 middle
- hover 时轴线高亮、点放大

### Tooltip
- 每维显示公式说明：胜率 / 盈亏比 / 资金量 / 绝对收益 / 稳定性 / 近期状态

## 9. Shared Rendering Utilities

### Hash Avatar
- 地址 hash 头像

### Direction Color Helper
- long → green
- short → red
