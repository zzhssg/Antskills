# SeerClaw Smart Money Scanner Business Spec

## 1. Product Structure

Scanner 回答的问题是：**现在大佬们在做什么方向？**

输入来自左侧栏：
- `coin`
- `timeWindow`
- `开始分析`

输出只包含 5 个模块：
- S1 HeadlineCard
- S2 StatsGrid
- S3 SmartMoneyChart
- S4 AddressList
- S5 ConsensusCard

## 2. Input and Billing Rules

### Scanner
- `coin`: `BTC | ETH | SOL | DOGE | WIF`
- `timeWindow`: `30m | 1h | 4h | 24h`
- 切换按钮不自动触发请求，必须点 `开始分析`
- 1 次 scan = 1 个 coin × 1 个 timeWindow

### Validation
- 输入都来自按钮组，不需要额外 freeform 校验
- 无匹配地址时返回空态，不是前端异常

## 3. Responsibility Split

- **Backend**：`summary`、`addresses`、`markers`、`candles`
- **AI**：`description`、`nicknames`、`consensus`
- **Frontend**：tier 映射、格式化、渲染顺序、K 线 marker 映射、点击卡片跳 Analyzer

## 4. Frontend Rule Mappings

### Tier mapping
```javascript
function getTier(winRate) {
  if (winRate >= 85) return { label: '传奇', color: '#fcd535', mark: '★' };
  if (winRate >= 75) return { label: '精英', color: '#0ecb81', mark: '◆' };
  if (winRate >= 70) return { label: '高手', color: '#0ecb81', mark: '◆' };
  if (winRate >= 60) return { label: '进阶', color: '#848e9c', mark: '●' };
  return { label: '新手', color: '#848e9c', mark: '●' };
}
```

## 5. Output Reading Order

- **3 秒**：看方向（做多 / 做空 / 分歧）
- **10 秒**：选地址（谁更值得点进 Analyzer）
- **30 秒**：读共识分析，决定是否继续深挖

## 6. Scanner Component Contract

### S1 HeadlineCard
- 标题必须是模板，不是 AI 自由发挥
- 文案模板：`🐋 {longCount}个做多、{shortCount}个做空——{方向判断} {coin}`
- `方向判断`：`longPct >= 60` → 共识偏向做多；`<= 40` → 共识偏向做空；否则多空分歧
- `description` 由 AI 提供

### S2 StatsGrid
- 三列：多头占比 / 净多头仓位 / 最高胜率
- 最高胜率取 `addresses[0].winRate`
- 昵称占位 `topNick` 依赖 AI 昵称，AI 未返回前先显示地址缩写或 skeleton

### S3 SmartMoneyChart
- 高度约 320px
- coin 锁定为当前扫描币种，不显示切币器
- 允许切周期
- marker 复用当前 scan 返回的数据

### S4 AddressList
- `addresses[]` 按 `winRate desc` 排序
- 每张卡显示：昵称、地址、tier、方向、杠杆、仓位、未实现盈亏、WL blocks、`pnl7d`、`profitRatio`
- hover 时显示 `点击分析→`

### S5 ConsensusCard
- 多 / 空比例条 + AI 共识说明
- 必须提示少数派风险，不要只吹单边

## 7. Marker and Chart Behavior

### Scanner
- chart 切周期时调用 `GET /api/chart?coin=X&interval=Y`
- 接口不返回 markers 时，复用已有 markers，重新映射到新蜡烛
- LONG marker 放在蜡烛下方，SHORT 放在蜡烛上方

### Scanner → Analyzer handoff
- 点击地址卡：切到 Analyzer、填入地址、自动执行分析
- 这是新的计费事件，不是复用 Scanner 结果

## 8. Error Handling

- `404 NO_ADDRESSES`：`当前无满足条件的聪明钱地址，可尝试放宽时间窗口`
- `502 UPSTREAM_ERROR`：`数据源暂时不可用，请稍后重试`
- AI 失败：仍然渲染数值部分，文案回退到安全占位

## 9. Quality Standards For AI Text

### Scanner copy
- `description`：20-60 字，解释筛选到的方向和显著特征
- `nicknames`：2-3 字中文，不可重复，要有风格感
- `consensus`：3-5 句，讲共振、分歧、风险，不要堆数字

## 10. Required Footer

```text
数据源 Hyperliquid API
⚠ 不构成投资建议
```
