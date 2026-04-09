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

## 3. Number Formatting

沿用 Scanner 的 `$1.4M / $42K / —` 规则，所有统计卡保持统一。

## 4. Rule Mappings

```javascript
function getFollowDifficulty(avgHold, winRate, avgLev) {
  if (avgHold < 30 || avgLev > 5) return '较高';
  if (avgHold > 120 && winRate > 75) return '较低';
  return '中等';
}

function getRadarGrade(score) {
  if (score >= 85) return 'S';
  if (score >= 75) return 'A+';
  if (score >= 65) return 'A';
  if (score >= 55) return 'B+';
  if (score >= 45) return 'B';
  return 'C';
}
```

## 5. Marker Enrichment

```javascript
function enrichAnalyzerMarkers(markers, profile, aiNickname, recentResults) {
  return markers.map(m => ({
    ...m,
    nick: aiNickname,
    tier: getTier(profile.winRate).label,
    wr: profile.winRate,
    pr: profile.profitRatio,
    res: recentResults
  }));
}
```

## 6. AI Call Architecture

### Analyzer AI input
```javascript
const followDifficulty = getFollowDifficulty(
  data.profile.avgHoldMinutes,
  data.profile.winRate,
  data.profile.avgLeverage || 1
);

const aiInput = {
  skill: 'analyzer',
  address: inputAddress,
  profile: data.profile,
  positions: data.positions,
  radar: data.radar,
  radarScore: data.radarScore,
  radarGrade: getRadarGrade(data.radarScore),
  recentResults: data.recentResults,
  followDifficulty,
};
```

## 7. AI Retry Logic

- `_selfScore.score >= 70`：通过
- `< 70`：追加原因重试
- 最多 3 次，取最高分版本
- timeout 5 秒

## 8. Loading State Rules

- 5 步动画
- 每步 280ms
- 最短展示 1600ms
- 建议文案：获取交易记录 → 聚合 round trips → 计算胜率与盈亏比 → 分析交易风格 → 生成跟单评估

## 9. SmartMoneyChart Rules

- 默认 coin = `preferredPairs[0]`
- 允许切 coin / 切周期
- 每次切换都请求 `/api/chart`
- marker 只显示当前 coin
- popover 必须显示补齐后的 `nick/tier/wr/pr/res`

## 10. Shared Color Tokens

沿用 Scanner 同一套暗色 tokens，避免 Analyzer 页面视觉漂移。

## 11. Output Validation Assets

- 样例输入：`templates/analyzer-ai-input.json`
- 样例输出：`templates/analyzer-ai-output.json`
- 结构校验：`node scripts/validate-ai-output.js templates/analyzer-ai-output.json`
