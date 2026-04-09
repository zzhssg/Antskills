# SeerClaw Scanner Visualization Specs Reference

## 1. WL Blocks

- 10 格横向小块
- 胜单用绿，负单用红，未知用灰
- 用于地址卡快速判断近况

## 2. Long/Short Ratio Bar

- 左侧绿色表示 long
- 右侧红色表示 short
- 中间显示比例文本
- 用在 ConsensusCard

## 3. K-line Trade Markers

### Architecture Layers
- TradingView candlestick layer
- DOM marker overlay
- hover popover

### Time Mapping
- 用最近 candle 对齐 marker 时间戳

### Marker Dot Styles
- LONG：绿色渐变
- SHORT：红色渐变
- tier / avatar / leverage mini badge 可叠加

### Hover Popover
- 最小宽度 240px
- 展示昵称、tier、方向、仓位、P/L、近况

## 4. Shared Rendering Utilities

### Hash Avatar
- 基于地址生成稳定头像

### Direction Color Helper
- long → green
- short → red

### HyperbotLink Component
- 地址文本支持跳转
