# SeerClaw Analyzer Visualization Specs Reference

## 1. Daily Bars

- 30 天日收益柱状图
- 绿正红负
- Y 轴建议对称

## 2. Cumulative Curve

- 30 天累计收益曲线
- 线 + 面积填充
- 右上角显示 total amount

## 3. Profit Distribution

- 5 桶横向条形图
- API 默认顺序：`>100% / 50~100% / 0~50% / -50~0% / <-50%`
- 正收益桶用绿，负收益桶用红

## 4. Hold Duration Distribution

- 5 桶进度条
- 用透明度变化强调占比高低

## 5. Active Hours Heatmap

- 24 小时活跃条
- 高值更亮
- 用在 A9 AnalysisPanel

## 6. K-line Trade Markers

### Architecture Layers
- TradingView candlestick layer
- DOM marker overlay
- hover popover

### Time Mapping
- 用最近 candle 对齐 marker 时间戳

### Marker Dot Styles
- LONG：绿色渐变
- SHORT：红色渐变
- mini badge 可显示 leverage

### Hover Popover
- 最小宽度 240px
- 展示昵称、tier、方向、仓位、P/L、最近结果

### Coin Filter Rule
- 只显示当前选中 coin 的 marker

## 7. Radar Chart

### Geometry
- 6 维 SVG polygon
- 中心显示 grade + numeric score

### Labels
- 左右标签做 text-anchor 调整
- hover 时轴线高亮

### Tooltip
- 解释 6 维评分公式

## 8. Shared Rendering Utilities

### Hash Avatar
- 基于地址生成稳定头像

### Direction Color Helper
- long → green
- short → red
