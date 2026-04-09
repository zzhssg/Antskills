# SeerClaw Analyzer API Specification Reference

## 1. Analyzer

### Request
```json
{
  "address": "0x1234abcd"
}
```

### Response Structure
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "profile": {},
    "positions": [],
    "account": {},
    "radar": {},
    "radarScore": 0,
    "dailyPnl": [],
    "curve": [],
    "profitDist": [],
    "holdDist": [],
    "hours": [],
    "trades": [],
    "markers": [],
    "candles": {}
  }
}
```

### profile Object
- `winRate`
- `profitRatio`
- `avgHoldMinutes`
- `avgLeverage`
- `totalTrades`
- `preferredPairs`
- `recent7dWinRate`

### positions[]
- 当前持仓列表；可能为空数组

### account Object
- `accountValue`
- `marginPct`
- `suggestedSize`
- `returnRate`

### radar Object
6 维：`winRate`、`profitRatio`、`capital`、`absPnl`、`stability`、`recentForm`

### trades[] / markers[] / candles
- trades：时间倒序
- markers：按 round trip 打点
- candles：按 coin 分桶的对象，而不是数组

## 2. Chart Switch

### Request
`GET /api/chart?coin=X&interval=Y&address=Z`

### Response
- `candles`
- `markers`

### Call Timing
- 切 coin
- 切周期

## 3. Market Data Helpers

### `/market/candles`
- 备用 K 线数据源

### `/market/ticker`
- 当前价格与 24h 统计

### `/market/coins`
- 币种元信息

## 4. Errors

- `404 NO_TRADES`
- `502 UPSTREAM_ERROR`
- `400 INVALID_ADDRESS`

## 5. Conventions

### Response Wrapper
所有接口都用：
```json
{ "code": 0, "message": "success", "data": {} }
```

### Numeric Precision
- 后端保留原精度
- 前端负责格式化显示与空值兜底

### Time Formatting
- chart 组件需要秒级 Unix 时间戳
