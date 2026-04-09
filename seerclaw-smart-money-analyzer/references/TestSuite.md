# SeerClaw Analyzer Test Suite

## 一、前端测试

### FE-1. 地址输入
- 非法地址按钮禁用
- 预设地址点击可自动执行
- Scanner 跳转带参可直接执行

### FE-2. 加载动画
- 5 步动画顺序正确
- 最短展示 1.6s

### FE-3. HeroCard / FollowAdvice
- Radar 与 narrative 同时渲染
- followDifficulty / followGrade 与前端映射一致
- suggestedSize 显示正确

### FE-4. 数据佐证区
- 日收益柱、累计曲线、收益分布、持仓时长、热力条都可渲染
- 空值显示 `—` 或 `∞`

### FE-5. SmartMoneyChart
- 默认 coin = `preferredPairs[0]`
- 切 coin 时 marker 被过滤
- 切周期会替换新 candles / markers

### FE-6. TradesTable
- ALL/BTC/ETH/SOL 筛选可用
- 10 条分页正确

## 二、后端测试

### BE-1. Analyzer API
- `/api/address/analyze` 返回 profile/positions/account/radar/trades/markers/candles
- `candles` 为按 coin 分桶对象

### BE-2. Chart API
- `/api/chart` 支持地址 + 币种 + 周期组合查询

## 三、端到端测试

### E2E-1. Analyzer 完整流程
- 输入地址
- 点击开始分析
- 渲染 11 个模块
- 切 coin / 切周期 / 翻页都正常

### E2E-2. 错误场景
- `NO_TRADES`
- `UPSTREAM_ERROR`
- AI 输出结构错误时安全回退
