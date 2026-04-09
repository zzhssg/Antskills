# SeerClaw Smart Money Scanner Implementation Guide

## 1. API Surfaces

- `POST /api/smart-money/scan`
- `GET /api/chart?coin=X&interval=Y`
- `GET /market/candles`
- `GET /market/ticker`
- `GET /market/coins`

## 2. Candle Parsing Rules

```javascript
function parseCandles(raw) {
  return raw.map(c => ({
    time: Math.floor((typeof c.t === 'number' ? c.t : parseInt(c.t)) / 1000),
    open: parseFloat(c.o),
    high: parseFloat(c.h),
    low: parseFloat(c.l),
    close: parseFloat(c.c),
    volume: parseFloat(c.v)
  }));
}
```

## 3. Number Formatting

```javascript
function fmt(n) {
  if (n == null || Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs}`;
}
```

## 4. Production-vs-Prototype Rule

- **生产模式**：后端返回 tier、排序、markers、AI 或 AI 输入所需字段
- **原型模式**：允许前端本地 mock candles / loading / sample 文案，但最终字段形状不能偏离生产契约

## 5. AI Call Architecture

### Preferred Production Path
- 后端返回 `data.ai`
- 前端直接合并渲染

### Temporary Frontend Fallback
如果后端暂未集成 AI：
1. API 返回纯数据
2. 前端构造 AI payload
3. 调用模型拿到 `description/nicknames/consensus`
4. 合并渲染

### Scanner AI input
```javascript
const aiInput = {
  skill: 'scanner',
  params: { coin, timeWindow },
  summary: data.summary,
  addresses: data.addresses
};
```

### Render Order
1. 先渲染 S1 模板标题、S2 数值、S3 图、S4 骨架
2. AI 返回后再补 description / nicknames / consensus
3. `topNick` 支持 placeholder/skeleton

## 6. AI Retry Logic

- `_selfScore.score >= 70`：通过
- `< 70`：把分数与原因追加到下一轮 prompt
- 最多 3 次，取最高分
- 单次 timeout 5 秒

## 7. Loading State Rules

- 5 步动画
- 每步 280ms
- 最短展示 1600ms
- Scanner steps：连接 API → 扫描地址 → 计算胜率 → 检测共振 → 生成共识

## 8. Layout & Interaction Rules

- 左侧面板宽 260px
- Scanner 地址卡 `.scan-card` hover：
  - 金色边框
  - 背景提亮
  - 上浮 1px
  - `点击分析→` 显现
- 外链地址按钮必须 `stopPropagation`
- 内容区出现动画：`fadeIn 0.35s`

## 9. SmartMoneyChart Rules

- `TradingView Lightweight Charts v4.1.3`
- Scanner 不显示切币器
- 周期：`1m / 5m / 15m / 1h / 4h / 1D`
- 切周期重新请求 chart
- 若未返回 markers，则复用旧 markers 重新映射
- 时间映射：最近 candle
- Y 位置：LONG 在 low 下方，SHORT 在 high 上方

## 10. Prototype Parity Notes

与 `smart-money-tracker.html` 对齐时：
- 首次进入允许处于 sample mode
- 点击 `开始分析` 后切 live mode
- 原型里的 local sample 不等于生产真实数据
- Scanner 图表通过 `coins={[coin]}` 或等效方式隐藏币种切换

## 11. Output Validation Assets

- 样例输入：`templates/scanner-ai-input.json`
- 样例输出：`templates/scanner-ai-output.json`
- 校验：`node scripts/validate-ai-output.js templates/scanner-ai-output.json`

## 12. Global Rule Thresholds (Reference)

### Tier
- `>=85 传奇`
- `>=75 精英`
- `>=70 高手`
- `>=60 进阶`
- `<60 新手`
