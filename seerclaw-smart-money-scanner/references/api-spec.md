# SeerClaw Scanner API Specification Reference

## 1. Scanner

### Request
```json
{
  "coin": "BTC",
  "timeWindow": "1h"
}
```

### Response Structure
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "summary": {},
    "addresses": [],
    "markers": [],
    "candles": []
  }
}
```

### summary Object
- `longCount`
- `shortCount`
- `longPct`
- `netLongPosition`

### addresses[]
- 已按 `winRate desc` 排序
- 关键字段：`address`、`winRate`、`profitRatio`、`positionSize`、`unrealizedPnl`、`direction`、`leverage`、`pnl7d`

### markers[]
- 每个地址一条主 marker
- `nick` 可能为空
- `tier` 由前端映射

### candles[]
- Hyperliquid 原始格式
- `o/h/l/c/v` 均为字符串

## 2. Chart Switch

### Request
`GET /api/chart?coin=X&interval=Y`

### Response
- `candles`
- 可能没有 `markers`

### Call Timing
- Scanner 切周期时调用
- 不支持切 coin

## 3. Market Data Helpers

### `/market/candles`
- 备用 K 线数据源

### `/market/ticker`
- 当前价格与 24h 统计

### `/market/coins`
- 币种元信息，用于按钮组或选择器

## 4. Errors

- `404 NO_ADDRESSES`
- `502 UPSTREAM_ERROR`
- `400 INVALID_PARAMS`

## 5. Conventions

### Response Wrapper
所有接口都用：
```json
{ "code": 0, "message": "success", "data": {} }
```

### Numeric Precision
- 后端保留原精度
- 前端负责格式化显示

### Time Formatting
- chart 组件需要秒级 Unix 时间戳
