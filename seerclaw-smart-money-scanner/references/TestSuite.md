# SeerClaw Scanner Test Suite

## 一、前端测试

### FE-1. 全局框架
- 左侧栏 / 右侧主区布局正确
- Footer 固定显示数据源与免责提示

### FE-2. 加载动画
- 5 步动画顺序正确
- 最短展示 1.6s
- API 很快返回时也不闪屏

### FE-3. SmartMoneyChart
- 初始渲染成功
- 切周期会刷新 candles
- marker 会映射到最近 candle
- LONG / SHORT 位置正确

### FE-4. Scanner 输出
- S1 标题模板正确
- S2 最高胜率取 `addresses[0]`
- S4 卡片排序正确
- S5 比例条与 AI 文案同时出现

### FE-5. 跳转 Analyzer
- 点击地址卡后自动切到 Analyzer
- 地址被带入输入框
- 自动触发新一轮分析

## 二、后端测试

### BE-1. Scanner API
- `/api/smart-money/scan` 正常返回 `summary/addresses/markers/candles`
- `code !== 0` 时前端可识别错误

### BE-2. 市场辅助接口
- `/api/chart` 支持切周期
- `/market/coins` 返回可用币种列表

## 三、端到端测试

### E2E-1. Scanner 完整流程
- 选 coin
- 选 timeWindow
- 点击开始分析
- 看加载态
- 渲染 5 个模块

### E2E-2. 错误场景
- `NO_ADDRESSES`
- `UPSTREAM_ERROR`
- AI 输出结构错误时安全回退
