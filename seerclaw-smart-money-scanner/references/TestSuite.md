# SeerClaw Scanner Test Suite

## 一、前端测试

### FE-1. 全局框架
- 左侧栏 260px
- Footer 固定显示数据源与免责声明

### FE-2. 加载动画
- 5 步顺序正确
- 最短展示 1.6s
- API 很快返回时不闪屏

### FE-3. SmartMoneyChart
- 初始渲染成功
- 只显示周期切换，不显示切币
- 周期切换会刷新 candles
- marker 映射到最近 candle
- 多 marker 同蜡烛会堆叠

### FE-4. Scanner 输出
- S1 标题模板正确
- S1 description 客观，不给建议
- S2 最高胜率取 `addresses[0]`
- S4 卡片排序正确
- S4 包含 7D PnL / profitRatio / WL / hover 提示
- S5 文案包含价位、风险、建议

### FE-5. 跳转 Analyzer
- 点击地址卡后自动切到 Analyzer
- 地址被带入输入框
- 自动触发新一轮分析
- HyperbotLink 点击不会触发跳转

## 二、后端测试

### BE-1. Scanner API
- `/api/smart-money/scan` 返回 `summary/addresses/markers/candles/ai`
- `addresses[]` 带 tier / pnl7d / profitRatio / recentResults
- `markers[]` 带 coin / res / lev / wr / pr

### BE-2. 地址发现与聚合
- 种子地址库 / 刷新机制存在
- 单地址字段计算正确
- 聚合字段正确

## 三、端到端测试

### E2E-1. Scanner 完整流程
- 选 coin
- 选 timeWindow
- 点击开始分析
- 看 loading
- 渲染 S1~S5

### E2E-2. 错误场景
- `NO_ADDRESSES`
- `UPSTREAM_ERROR`
- AI 输出结构错误时安全回退

### E2E-3. 原型模式
- sample banner / watermark 可见
- 点击开始分析进入 live 模式
