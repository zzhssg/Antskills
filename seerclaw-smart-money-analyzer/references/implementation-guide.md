# SeerClaw Smart Money Analyzer Implementation Guide

## 1. API Surfaces

- `POST /api/address/analyze`
- `GET /api/chart?coin=X&interval=Y&address=Z`
- `GET /market/candles`
- `GET /market/ticker`
- `GET /market/coins`

## 2. Candle Parsing Rules

```javascript
function parseCoinCandles(rawByCoin) {
  return Object.fromEntries(
    Object.entries(rawByCoin).map(([coin, candles]) => [coin, candles.map(c => ({
      time: Math.floor((typeof c.t === 'number' ? c.t : parseInt(c.t)) / 1000),
      open: parseFloat(c.o),
      high: parseFloat(c.h),
      low: parseFloat(c.l),
      close: parseFloat(c.c),
      volume: parseFloat(c.v)
    }))])
  );
}
```

## 3. Number Formatting & Empty Values

- 金额统一 `$1.4M / $42K / —`
- `profitRatio === null` → `∞` 或 `—`
- `recent7dWinRate === null` → `—`
- `avgLeverage === null` → `—`

## 4. Production-vs-Prototype Rule

- **生产模式**：后端返回 tier / followDifficulty / radarGrade / suggestedSize / ai 或 AI 输入所需字段
- **原型模式**：允许前端 sample 数据与本地 fallback，但字段语义不能偏离 PRD

## 5. AI Call Architecture

### Preferred Production Path
- 后端直接返回 `data.ai`

### Temporary Frontend Fallback
- 如果后端暂未集成 AI，前端可自己调用模型
- 但 `followDifficulty` / `radarGrade` 优先使用后端输入

### Analyzer AI input
```javascript
const aiInput = {
  skill: 'analyzer',
  address: inputAddress,
  profile: data.profile,
  positions: data.positions,
  radar: data.radar,
  radarScore: data.radarScore,
  radarGrade: data.radarGrade,
  recentResults: data.recentResults,
  followDifficulty: data.followDifficulty,
};
```

## 6. Marker Enrichment

如果 marker 原始字段缺少 `nick/tier/wr/pr/res`：
```javascript
function enrichAnalyzerMarkers(markers, profile, aiNickname, recentResults) {
  return markers.map(m => ({
    ...m,
    nick: m.nick ?? aiNickname,
    tier: m.tier ?? profile.tier,
    wr: m.wr ?? profile.winRate,
    pr: m.pr ?? profile.profitRatio,
    res: m.res ?? recentResults,
  }));
}
```

## 7. AI Retry Logic

- `_selfScore.score >= 70`：通过
- `< 70`：追加原因重试
- 最多 3 次，取最高分
- timeout 5 秒

## 8. Loading State Rules

- 5 步动画
- 每步 280ms
- 最短展示 1600ms
- Analyzer steps：获取记录 → 聚合 RT → 计算胜率与盈亏比 → 分析风格 → 生成跟单评估

## 9. Layout & Interaction Rules

- 左侧面板宽 260px
- 地址非法时按钮禁用
- preset 点击可填地址并直接执行
- Scanner 跳转时自动填地址 + 自动执行
- `tbl-row` hover 高亮，并触发图表联动
- `page-btn` disabled 时 40% opacity + not-allowed

## 10. SmartMoneyChart Rules

- 默认 coin = `preferredPairs[0]`
- 支持切币 / 切周期
- 周期：`1m / 5m / 15m / 1h / 4h / 1D`
- 切换都重新请求 `/api/chart`
- marker 只显示当前 coin
- popover 显示补齐后的 `nick/tier/wr/pr/res`

## 11. Follow Advice / Suggested Size Rules

- `followDifficulty` 直接用后端返回
- `followGrade` 直接用 `radarGrade`
- `suggestedSize` 直接用后端返回
- 当前若只有原型，需要同时支持：
  - 有持仓：取最大仓位 × 2%
  - 无持仓：取最近10笔平均仓位 × 2%

## 12. Prototype Parity Notes

与 `smart-money-tracker.html` 对齐时：
- 原型里 difficulty / grade 可能是硬编码 sample 值，生产版必须改为数据驱动
- 原型里 row hover 可能只高亮未联动，生产版要补 chart linkage
- A2 footer 除了 marginPct 还要补 available balance

## 13. Output Validation Assets

- 样例输入：`templates/analyzer-ai-input.json`
- 样例输出：`templates/analyzer-ai-output.json`
- 校验：`node scripts/validate-ai-output.js templates/analyzer-ai-output.json`

## 14. Global Rule Thresholds (Reference)

### Tier
- `>=85 传奇`
- `>=75 精英`
- `>=70 高手`
- `>=60 进阶`
- `<60 新手`

### FollowDifficulty
- `avgHold > 120 && winRate > 75` → `较低`
- `avgHold 30-120` → `中等`
- `avgHold < 30 || avgLeverage > 5` → `较高`

### RadarGrade
- `>=85 S`
- `>=75 A+`
- `>=65 A`
- `>=55 B+`
- `>=45 B`
- `<45 C`
