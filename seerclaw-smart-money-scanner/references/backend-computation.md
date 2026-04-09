# SeerClaw Scanner Backend Computation Reference

## 1. Address Discovery (Scanner Core Difficulty)

Hyperliquid 没有直接“列出所有大额地址”的端点。MVP 推荐：
1. 维护种子地址库
2. 每 5 分钟刷新这些地址的持仓变化
3. 建立按 coin / 时间窗口的索引
4. 补充 websocket / 社区榜单做新地址发现

可选策略：
- 方案 A：定期刷新种子地址库（MVP 推荐）
- 方案 B：基于 clearinghouseState 批量查询已有候选
- 方案 C：监听大额开仓事件，动态增补

## 2. Data Collection Sequence

```text
1. metaAndAssetCtxs → 获取 coin 列表
2. 遍历种子地址 → clearinghouseState
3. 筛选该 coin 上持仓 ≥ $100K 的地址
4. userFills(近30天) → 聚合 round trips
5. allMids → 当前价格
6. candleSnapshot(coin, interval=用户选择)
```

## 3. Per-address Calculations

- `winRate = 盈利 round trips / 总 round trips × 100`
- `pnl7d = Σ(近7天 round trips 的 pnl)`
- `profitRatio = avg(winPnl) / abs(avg(lossPnl))`
- `recentResults[10] = 最近10笔已平仓 round trips 的胜负`
- `entryPrice = 当前 coin 主仓位的入场均价`
- `positionSize = 当前 coin 仓位 USD 价值`
- `unrealizedPnl = 当前未实现盈亏`
- `positionAge = 开仓至今的人类可读时间`
- `tier = 后端根据 winRate 映射`

## 4. Aggregate Calculations

- `longCount / shortCount`
- `longPct = longCount / total × 100`
- `netLongPosition = Σ(long positions) - Σ(short positions)`

## 5. Marker Generation

每个地址产出一条 Scanner marker：
- 取该地址在所选 coin 上的**代表性当前持仓**
- 若分批入场，取最大仓位那一笔的入场点
- marker 要带：`addr/nick/tier/wr/pr/dir/lev/price/size/time/pnl/pnlPct/ago/res/coin`

## 6. Response Assembly

Scanner 最终返回：
- `summary`
- `addresses[]`
- `markers[]`
- `candles[]`
- `ai{ description, nicknames, consensus, _selfScore }`

## 7. Production Rule Ownership

以下规则在生产口径里由后端计算并返回：
- `tier`
- 统计排序
- marker 所属主仓位选择
- 所有 PnL / ratio / recentResults

## 8. Global Rule Thresholds

### Tier Mapping (Backend Source of Truth)
- `winRate >= 85` → `传奇` / `#fcd535` / `★`
- `winRate >= 75` → `精英` / `#0ecb81` / `◆`
- `winRate >= 70` → `高手` / `#0ecb81` / `◆`
- `winRate >= 60` → `进阶` / `#848e9c` / `●`
- `< 60` → `新手` / `#848e9c` / `●`
