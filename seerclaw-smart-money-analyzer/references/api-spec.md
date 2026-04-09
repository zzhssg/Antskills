# SeerClaw Analyzer API Specification Reference

## 1. PRD Source-of-Truth Contract

按 PRD §7.2，Analyzer 的标准响应形状是**顶层业务字段**，不是额外包一层 `code/message/data`：

### Request
```json
{ "address": "0x1234abcd" }
```

### Response Structure
```json
{
  "profile": {},
  "positions": [],
  "account": {
    "accountValue": 0,
    "totalMargin": 0,
    "availableMargin": 0,
    "marginPct": 0,
    "returnRate": 0
  },
  "radar": {},
  "radarGrade": "A+",
  "radarScore": 80,
  "dailyPnl": [],
  "curve": [],
  "profitDist": [],
  "holdDist": [],
  "hours": [],
  "trades": [],
  "markers": [],
  "candles": {},
  "recentResults": [1,1,0,1,1,1,0,1,1,1],
  "suggestedSize": 10000,
  "followDifficulty": "中等",
  "ai": {
    "nickname": "快刀手",
    "narrative": "...",
    "followAdvice": "...",
    "followGrade": "A+",
    "_selfScore": {"score": 85, "reason": "..."}
  }
}
```

> 如果实际后端为了通用网关包装成 `{ code, message, data }`，前端必须先 **unwrap 到上述 PRD 形状** 再渲染。实现和文档以 PRD 顶层形状为准。

## 2. profile Object

至少包含：
- `totalTrades`
- `wins / losses`
- `winRate`
- `pnl30d`
- `profitRatio`
- `maxDrawdown`
- `avgHoldMinutes`
- `avgLeverage`
- `avgWin / avgLoss`
- `maxWin / maxLoss`
- `preferredPairs`
- `recent7dWinRate`
- `avgPositionSize`
- `tier`

## 3. positions[]

每项至少包含：
- `pair`
- `dir`
- `lev`
- `entry`
- `size`
- `pnl`
- `pct`
- `liq`
- `marginUsed`

## 4. account Object

必须至少有：
- `accountValue`
- `totalMargin`
- `availableMargin`
- `marginPct`
- `returnRate`

## 5. trades[] / markers[] / candles / recentResults

- `trades[]`：时间倒序
- `markers[]`：按 round trip 打点，必须含 `coin`
- `candles`：按 coin 分桶对象
- `recentResults[10]`：最近 10 笔已平仓胜负，用于 AI 与 marker enrichment

> `recentResults` 必须显式存在，因为 Analyzer AI 输入和 marker popover 补齐都会用它。

## 6. Chart Switch

### Request
`GET /api/chart?coin=X&interval=Y&address=Z`

### Response
```json
{
  "candles": [...],
  "markers": [...]
}
```

### Call Timing
- 切 coin
- 切周期

## 7. Errors

- `404 NO_TRADES`
- `502 UPSTREAM_ERROR`
- `400 INVALID_ADDRESS`

## 8. Error UI Contract

- `NO_TRADES`：错误卡 + 检查地址提示 + retry button
- `UPSTREAM_ERROR`：错误卡 + `数据源暂时不可用，请稍后重试` + retry button
- `INVALID_ADDRESS`：前端按钮禁用；若后端仍返回该错误，也显示错误卡

## 9. Contract Notes

- 生产实现推荐后端直接返回 `followDifficulty/radarGrade/suggestedSize/ai`
- 如果当前阶段后端尚未集成 AI，前端可临时自行调用模型，但最终页面状态仍应整理成这里定义的顶层字段形状

## Package precedence rule

- PRD 里的内联 JSON 示例主要用于说明结构方向，可能比最终落地字段更薄。
- **实现时以本 package 的 `api-spec.md + backend-computation.md + implementation-guide.md` 组合契约为准。**
- 若与 PRD 的简写示例冲突，优先采用 package 内的完整字段定义，并保持业务语义不变。
