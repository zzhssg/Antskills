# SeerClaw Scanner API Specification Reference

## 1. PRD Source-of-Truth Contract

按 PRD §7.1，Scanner 的标准响应形状是**顶层业务字段**，不是额外包一层 `code/message/data`：

### Request
```json
{ "coin": "BTC", "timeWindow": "1h" }
```

### Response Structure
```json
{
  "summary": {
    "longCount": 4,
    "shortCount": 1,
    "longPct": 80,
    "netLongPosition": 4800000
  },
  "addresses": [],
  "candles": [],
  "markers": [],
  "ai": {
    "description": "...",
    "nicknames": {"0x...": "快刀手"},
    "consensus": "...",
    "_selfScore": {"score": 82, "reason": "..."}
  }
}
```

> 如果实际后端为了通用网关包装成 `{ code, message, data }`，前端必须在进入页面状态前先 **unwrap 到上述 PRD 形状**。实现和文档以 PRD 顶层形状为准。

## 2. summary Object

- `longCount`
- `shortCount`
- `longPct`
- `netLongPosition`

## 3. addresses[]

每项至少包含：
- `address`
- `winRate`
- `tier`
- `direction`
- `leverage`
- `positionSize`
- `unrealizedPnl`
- `entryPrice`
- `positionAge`
- `pnl7d`
- `profitRatio`
- `recentResults[10]`
- `avgHoldMinutes`
- `totalTrades`

> `avgHoldMinutes` 与 `totalTrades` 必须存在，因为 Scanner AI 命名与风格判断会用到。

## 4. markers[]

每项建议结构：
- `addr`
- `nick`
- `tier`
- `wr`
- `pr`
- `dir`
- `lev`
- `price`
- `size`
- `time`
- `pnl`
- `pnlPct`
- `ago`
- `res[]`
- `coin`

## 5. candles[]

- Hyperliquid 原始格式
- `o/h/l/c/v` 为字符串
- 前端 parse 为 TradingView 数值

## 6. Chart Switch

### Request
`GET /api/chart?coin=X&interval=Y`

### Response
```json
{
  "candles": [...],
  "markers": [...]
}
```

### Call Timing
- Scanner 切周期时调用
- Scanner 不支持切 coin
- 如果 chart 接口没回 markers，前端复用现有 markers 重新映射

## 7. Market Data Helpers

- `/market/candles`
- `/market/ticker`
- `/market/coins`

## 8. Errors

- `404 NO_ADDRESSES`
- `502 UPSTREAM_ERROR`
- `400 INVALID_PARAMS`

## 9. Error UI Contract

- `NO_ADDRESSES`：错误卡 + 文案 + retry button
- `UPSTREAM_ERROR`：错误卡 + `数据源暂时不可用，请稍后重试` + retry button

## 10. Contract Notes

- 生产实现推荐后端直接返回 `ai`
- 如果当前阶段后端尚未集成 AI，前端可临时自行调用模型，但最终页面状态仍应整理成这里定义的顶层字段形状

## Package precedence rule

- PRD 里的内联 JSON 示例主要用于说明结构方向，可能比最终落地字段更薄。
- **实现时以本 package 的 `api-spec.md + backend-computation.md + implementation-guide.md` 组合契约为准。**
- 若与 PRD 的简写示例冲突，优先采用 package 内的完整字段定义，并保持业务语义不变。
