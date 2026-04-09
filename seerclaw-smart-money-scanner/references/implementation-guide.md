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
  if (n == null || isNaN(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs}`;
}
```

## 4. AI Call Architecture

### Scanner AI input
```javascript
const aiInput = {
  skill: 'scanner',
  params: { coin, timeWindow },
  summary: data.summary,
  addresses: data.addresses
};
```

### Scanner render order
1. 先渲染数值组件
2. AI 返回后补 description / nicknames / consensus
3. 受影响组件二次 render

## 5. AI Retry Logic

- `_selfScore.score >= 70`：通过
- `< 70`：把上次分数和原因追加给模型，再试一次
- 最多 3 次，取最高分结果
- 单次 timeout 5 秒

## 6. Loading State Rules

- 5 步动画
- 每步 280ms
- 最短展示 1600ms
- 建议文案：连接 API → 扫描地址 → 计算胜率 → 检测共振 → 生成共识

## 7. Shared Color Tokens

```javascript
const C = {
  bg: '#0b0e18',
  sidebar: '#0a0e1a',
  card: '#111623',
  cardBorder: 'rgba(255,255,255,0.08)',
  text1: 'rgba(255,255,255,0.92)',
  text2: 'rgba(255,255,255,0.72)',
  text3: 'rgba(255,255,255,0.48)',
  text4: 'rgba(255,255,255,0.28)',
  up: '#0ecb81',
  dn: '#f6465d',
  yl: '#fcd535',
};
```

## 8. SmartMoneyChart Rules

- Scanner 不显示切币器
- 允许切周期
- 切周期后如果接口没返回 markers，复用旧 markers 重新映射
- marker 时间戳映射到最近蜡烛
- LONG 在 candle low 下方，SHORT 在 candle high 上方

## 9. Visualization Contracts

- WL blocks：10 格，按近 10 次结果着色
- Long/Short ratio bar：左绿右红，中间显示比例
- marker popover：显示昵称、tier、方向、仓位、P/L、近况

## 10. Output Validation Assets

- 样例输入：`templates/scanner-ai-input.json`
- 样例输出：`templates/scanner-ai-output.json`
- 结构校验：`node scripts/validate-ai-output.js templates/scanner-ai-output.json`
