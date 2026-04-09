# SeerClaw Analyzer Backend Computation Reference

## 1. Data Collection Sequence

```text
1. clearinghouseState(address) → 当前持仓
2. userFills(address, 近30天) → 历史成交
3. allMids → 当前价格
4. candleSnapshot(coin, interval) → 各偏好币种 K 线
```

## 2. Round Trip Aggregation

从 `userFills` 聚合：
1. 按 coin 分组
2. 同方向连续 fills 合并为入场
3. 反方向 fills 作为平仓
4. 完整配对后计算：
   - `PnL($) = exitValue - entryValue - fees`
   - `PnL(%) = PnL / entryValue × 100`
   - `holdMinutes = (exitTime - entryTime) / 60`
   - `win = PnL > 0`

## 3. Base Statistics

- `totalTrades`
- `wins / losses`
- `winRate`
- `pnl30d`
- `profitRatio`
- `avgWin / avgLoss`
- `maxWin / maxLoss`
- `avgHoldMinutes`
- `avgLeverage`
- `maxDrawdown`
- `preferredPairs`（交易频次 Top3）
- `recent7dWinRate`
- `returnRate = pnl30d / accountValue × 100`

## 4. Radar 6 Dimensions (Backend Source of Truth)

```text
winRate     = clamp(0,100, winRate)
profitRatio = clamp(0,100, profitRatio / 5 × 100)
capital     = clamp(0,100, 20 × log10(avgPositionSize / 10000))
absPnl      = clamp(0,100, 20 × log10(abs(pnl30d) / 50000))
stability   = clamp(0,100, 100 - abs(maxDrawdown) × 5)
recentForm  = clamp(0,100, recent7dWinRate / overallWinRate × 100)
```

- `radarScore = avg(6 dims)`
- `radarGrade` 由 `radarScore` 映射

## 5. Follow Difficulty / Grade / Suggested Size

生产口径：
- `followDifficulty` 后端计算并返回
- `followGrade = radarGrade`
- `suggestedSize`：
  - 有持仓：`max(positions[].size) × 0.02`，向下取整到 `$1000`
  - 无持仓：`avg(近10笔 roundTrip.positionSize) × 0.02`，向下取整到 `$1000`

## 6. Distribution Data

- `dailyPnl[30]`
- `curve[30] = dailyPnl prefix sum`
- `profitDist[5]`: `>100% / 50~100% / 0~50% / -50~0% / <-50%`
- `holdDist[5]`: `<15m / 15-30m / 30-60m / 1-2h / >2h`
- `hours[24]`: UTC 开仓小时分布

## 7. Marker Generation

每笔 round trip 生成一条 Analyzer marker：
- 必带 `coin`
- 用于 A10 切币过滤
- popover 原始字段若不足，前端再用 profile/recentResults 做补齐

## 8. Account Fields

A2 footer 至少要有：
- `accountValue`
- `totalMargin`
- `availableMargin` / available balance
- `marginPct`

## 9. Production Rule Ownership

以下规则在生产口径里由后端计算并返回：
- `tier`
- `followDifficulty`
- `radarGrade`
- `suggestedSize`
- 所有 radar / distribution / returnRate / drawdown 指标

## 10. Global Rule Thresholds

### Tier Mapping (Backend Source of Truth)
- `winRate >= 85` → `传奇` / `#fcd535` / `★`
- `winRate >= 75` → `精英` / `#0ecb81` / `◆`
- `winRate >= 70` → `高手` / `#0ecb81` / `◆`
- `winRate >= 60` → `进阶` / `#848e9c` / `●`
- `< 60` → `新手` / `#848e9c` / `●`

### FollowDifficulty Mapping (Backend Source of Truth)
- `avgHold > 120min && winRate > 75%` → `较低`
- `avgHold 30-120min` → `中等`
- `avgHold < 30min || avgLeverage > 5x` → `较高`

### RadarGrade Mapping (Backend Source of Truth)
- `score >= 85` → `S`
- `score >= 75` → `A+`
- `score >= 65` → `A`
- `score >= 55` → `B+`
- `score >= 45` → `B`
- `< 45` → `C`
