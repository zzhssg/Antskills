# SeerClaw Smart Money Scanner Skill Review

**审查范围：** Scanner（聪明钱扫描）skill 2.0
**对比基准：** `references/api-spec.md` §addresses[] + `SKILL.md` §6.2
**审查对象：** `references/result.html`

---

## 第一类：数据缺失问题

### Scanner addresses[] 字段接入情况

| # | 字段 | api-spec 位置 | result.html | 状态 |
|---|------|-------------|-------------|------|
| 1 | address | §addresses[] | ✓ 0xa11f...f643 | 正常 |
| 2 | winRate | §addresses[] | ✓ 100% | 正常 |
| 3 | direction | §addresses[] | ✓ SHORT/LONG | 正常 |
| 4 | leverage | §addresses[] | ✓ 25x/8x | 正常 |
| 5 | positionSize | §addresses[] | ✓ $895K | 正常 |
| 6 | unrealizedPnl | §addresses[] | ✓ -$49.5K | 正常 |
| 7 | unrealizedPct | §addresses[] | ✓ -5.5% | 正常 |
| 8 | **profitRatio** | §addresses[] | **✗ 缺失** | 缺失 |
| 9 | **pnl7d** | §addresses[] | **✗ 缺失** | 缺失 |
| 10 | **totalTrades** | §addresses[] | **✗ 缺失** | 缺失 |
| 11 | **avgHoldMinutes** | §addresses[] | **✗ 缺失** | 缺失 |
| 12 | **positionAge** | §addresses[] | **✗ 缺失** | 缺失 |
| 13 | **recentResults**（WL方块） | §addresses[] | **✗ 缺失** | 缺失 |

### 字段说明

| 缺失字段 | 含义 | 用途 |
|---------|------|------|
| `profitRatio` | 盈亏比 = 均赢 ÷ 均亏（avgWin / avgLoss），不是百分比 | S4 卡片展示；AI 输入需要 |
| `pnl7d` | 7日累计盈亏（美元） | S4 卡片展示 |
| `totalTrades` | 该地址30日总 Round Trip 笔数 | AI 输入需要；S4 卡片可选 |
| `avgHoldMinutes` | 平均持仓时长（分钟） | AI 计算 followDifficulty 需要 |
| `positionAge` | 当前持仓时间，如"38分钟前" | S4 卡片时间标签 |
| `recentResults` | 最近10笔 W/L 的 int[]，1=赢 0=输 | S4 卡片 WL 方块（viz-specs.md 像素规范） |

### 说明

- `unrealizedPnl` + `unrealizedPct`（未结盈亏美元额+百分比）result.html **已有**，合并在一列里显示
- `profitRatio`（盈亏比）和 `unrealizedPct`（盈亏百分比）是两个完全不同的指标：Ratio 是均值比率，Pct 是持仓盈亏率

---

## 第二类：前端组件问题

### SKILL.md §6.2 定义的 Scanner 5 个组件 vs result.html

| # | 组件 | SKILL.md 位置 | result.html | 状态 |
|---|------|-------------|-------------|------|
| 1 | **HeadlineCard** | §6.2 S1 | ✗ 缺失 | 只有一句简单共识文字 |
| 2 | **StatsGrid** | §6.2 S2 | ✗ 缺失 | 无3列统计卡片 |
| 3 | **SmartMoneyChart** | §6.2 S3 + §7.4 | ✗ 缺失 | 无 K 线图 |
| 4 | **AddressList** | §6.2 S4 | △ 部分实现 | 表格形式存在，但缺少 profitRatio/pnl7d/positionAge/WL方块 |
| 5 | **ConsensusCard** | §6.2 S5 | △ 部分实现 | 有共识文字，但无多空比例条 |

### 逐项说明

**S1 HeadlineCard（缺失）：**
- 规范：渐变背景卡片 + 模板化标题 `🐋 {longCount}个做多、{shortCount}个做空——{consensus方向} {coin}`
- 标题是前端模板计算，**不需要 AI**
- 共识方向规则：longPct≥60 → "共识偏向做多"，≤40 → "共识偏向做空"，else → "多空分歧"
- result.html：只有一句 `📈 共识偏向做空`，不符合模板规范

**S2 StatsGrid（缺失）：**
- 规范：3列统计 — 多头占比(绿) / 净多头仓位(绿或红) / 最高胜率(金)
- `topWinRate` 从 `addresses[0].winRate` 取，不是 summary 自带的
- result.html：无此组件

**S3 SmartMoneyChart（缺失）：**
- 规范：TradingView K 线 + 头像标记点 + 悬浮气泡；h=320px；Scanner 模式下 coin 锁定不切换
- markers 来自 api-spec §markers[]
- result.html：无 K 线图

**S4 AddressList（部分实现）：**
- 规范：可点击卡片列表，含 Avatar + 昵称 + HyperbotLink + tier badge + 方向杠杆 pill + positionSize + 未结盈亏 + WL方块×10 + pnl7d + profitRatio + "点击分析→"悬停提示
- result.html：以表格行展示，缺少 profitRatio、pnl7d、positionAge、recentResults（WL方块）

**S5 ConsensusCard（部分实现）：**
- 规范：多空比例条（绿/红渐变）+ AI consensus 文字
- result.html：有共识文字，无比例条

---

## 附录

### 规范文件索引

| 文件 | 作用 |
|-----|------|
| `references/api-spec.md` §addresses[] | Scanner addresses[] 字段 schema（14个字段） |
| `references/api-spec.md` §markers[] | Scanner markers 字段 schema |
| `SKILL.md` §6.2 | Scanner 5个组件及各自消费的数据 |
| `SKILL.md` §7.4 | SmartMoneyChart 组件行为规范 |
| `references/viz-specs.md` | WL 方块像素规范 |
| `references/ai-prompts.md` §8 | Scanner AI 输入 payload 字段清单（包含 profitRatio/pnl7d/totalTrades/avgHoldMinutes） |
