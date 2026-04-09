# SeerClaw Scanner Visualization Specs Reference

## 1. WL Blocks

- 最近 10 笔已平仓结果
- 左早右近
- W=绿，L=红
- 前 7 个 opacity `0.4`
- 后 3 个 opacity `1.0`
- 不足 10 笔不补空位

## 2. Long/Short Ratio Bar

- 左绿右红
- 绿宽 = `longPct%`
- 红宽 = `100-longPct%`
- 两端文字：`多 X%` / `Y% 空`
- 高度 10px，圆角 5px

## 3. K-line Trade Markers

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
- LONG：绿渐变 + 方向色环
- SHORT：红渐变 + 方向色环
- 右下角 mini leverage badge

### Hover Popover
- 最小宽度 240px
- 字段：
  - 头像 + 昵称 + tier + 胜率
  - LONG/SHORT + 杠杆
  - 入场价 / 仓位
  - 盈亏 / 盈亏%
  - 盈亏比（可选）
  - 开仓时间 ago
  - WL × 10
- 样式：圆角10px / blur / fadeIn / 金色边框

## 4. Shared Rendering Utilities

### Hash Avatar
- 确定性 hash→SVG / canvas

### Direction Color Helper
- long → green
- short → red

### HyperbotLink Component
- 地址文本可跳外链
- 必须 `stopPropagation`
