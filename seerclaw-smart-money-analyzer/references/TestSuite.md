# SeerClaw Analyzer Test Suite

## 一、前端测试

### FE-1. 地址输入
- 非法地址按钮禁用
- preset 点击可自动执行
- Scanner 跳转带参可直接执行

### FE-2. 加载动画
- 5 步顺序正确
- 最短展示 1.6s

### FE-3. HeroCard / FollowAdvice
- Avatar / nickname / tier / HyperbotLink / 6 指标都在
- Radar 含 6 维与公式 tooltip
- followDifficulty / followGrade 来自数据，而非硬编码
- suggestedSize 有无持仓两种路径都正确

### FE-4. 数据佐证区
- Divider 正确
- 日收益柱 / 累计曲线 / 收益分布 / 持仓时长 / UTC heatmap 全部可渲染
- 空值显示 `—` 或 `∞`

### FE-5. 当前持仓与图表
- 无持仓空态正确
- footer 同时显示 account value / margin usage / available balance
- 默认 coin = `preferredPairs[0]`
- 切 coin 只显示该 coin markers
- 切周期刷新 candles / markers

### FE-6. TradesTable
- ALL/BTC/ETH/SOL 筛选可用
- 10 条分页正确
- row hover 高亮并与图表联动

## 二、后端测试

### BE-1. Analyzer API
- `/api/address/analyze` 返回 `profile/positions/account/radar/radarGrade/radarScore/distributions/trades/markers/candles/suggestedSize/followDifficulty/ai`
- `account` 带 `availableMargin`
- `markers[]` 带 `coin`

### BE-2. Round Trip & Radar
- Round Trip 聚合正确
- 6 维 radar 公式正确
- returnRate / recent7dWinRate / preferredPairs 正确

## 三、端到端测试

### E2E-1. Analyzer 完整流程
- 输入地址
- 点击开始分析
- 渲染 A1~A11
- 切 coin / 切周期 / 翻页正常

### E2E-2. 错误场景
- `NO_TRADES`
- `UPSTREAM_ERROR`
- AI 输出结构错误时安全回退

### E2E-3. 原型模式
- sample mode / live mode 逻辑正常
- 生产版去掉硬编码 difficulty / grade
