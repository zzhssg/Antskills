# Yield Desk · 技术接口与数据提需

> 这份文档给技术同学阅读。目的不是重复 PRD，而是把“现在产品做到哪了”和“还需要哪些接口/数据实现”讲清楚。

## 1. 当前产品现状

### 已经完成 / 可复用
- 4 层 pipeline 结构已拆清：`L1 → L2 → L3 → L4`
- L2 的产品过滤、评分、排序、异常检测已基本成型
- 本地安全元数据 YAML 已可直接复用
- `frontend/yield-desk.html` 已有高保真产品原型
- `tests/test_l2_scorer.py` 当前通过 `16/16`

### 仍是 mock / stub / PRD 的部分
- Antseer 主通道仍未锁定真实接口契约
- Binance 之外的大多数 CEX connector 还是 stub
- L3 的 API key / env / prompt 调优闭环未完成
- 前端仍在使用 mock 数据，未接真实 pipeline 输出
- `frontend/l3-decision-prompt-tuner.html` 在文档中被引用，但当前包内缺失

## 2. 目标用户流

```text
用户选择稳定币 / 风险偏好 / 平台偏好
→ 请求 L1 产品与安全元数据
→ L2 计算 security / convenience / stability / anomaly
→ L3 生成推荐结论与说明
→ L4 渲染 yield-desk 前端视图
```

## 3. 需要技术实现的接口清单

| 优先级 | 接口 | 方法 | 用途 | 阻塞模块 | 状态 |
|---|---|---|---|---|---|
| P0 | `/api/v1/earn/products` | GET | 聚合全部 CEX + DeFi Earn 产品，映射到 `RawProduct` | L1 / L2 / 前端首屏 | 未实现 |
| P0 | `/api/v1/yield/history` | GET | 单池 30 日 APY / 收益率时序 | L2 稳定性评分 / 前端图表 | 未实现 |
| P0 | `/api/v1/market/gas` 或等价能力 | GET | DeFi gas 估算 / convenience 评分 | L2 convenience | 未实现 |
| P1 | `/api/v1/safety/meta` | GET | 平台 / 协议安全元数据 | L1 enrich / 前端 badge | 未实现（可先用本地 YAML） |
| P1 | 各交易所 Earn 直连接口 | GET/POST | Antseer fallback | L1 fallback | 多数为 stub |

## 4. 数据 Schema 提需

### 4.1 请求参数

#### `/api/v1/earn/products`

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `assets` | string[] / csv | ❌ | `USDT,USDC,DAI` | 过滤目标稳定币 |
| `venues` | string[] / csv | ❌ | `binance,okx,aave` | 限定平台范围 |
| `include_defi` | boolean | ❌ | `true` | 是否包含 DeFi 协议 |
| `include_cex` | boolean | ❌ | `true` | 是否包含 CEX 产品 |

#### `/api/v1/yield/history`

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `product_id` | string | ✅ | `binance_usdt_flexible` | 对应统一 product id |
| `days` | int | ❌ | `30` | 默认 30 天 |

### 4.2 响应字段

#### `RawProduct` 最低必需字段

| 字段 | 类型 | 必填 | 示例 | 用于哪个模块 | 说明 |
|---|---|---|---|---|---|
| `product_id` | string | ✅ | `okx_usdt_30d` | 全链路 | 全局唯一 id |
| `platform_slug` | string | ✅ | `okx` | L2 / 前端 | 平台标识 |
| `venue_type` | string | ✅ | `cex` / `defi` | L2 / 前端 | 类型标签 |
| `asset` | string | ✅ | `USDT` | 过滤 / 前端 | 币种 |
| `apr` | number | ✅ | `0.085` | L2 / 前端 | 年化收益率，小数表示或需统一口径 |
| `apr_tiers` | object/array | ❌ | `{ "0-1000": 0.08 }` | L2 | 阶梯 APR |
| `lock_days` | int | ❌ | `30` | L2 / 前端 | 锁仓时长 |
| `is_flexible` | boolean | ✅ | `true` | L2 convenience / 前端 | 是否灵活赎回 |
| `remaining_capacity` | number/null | ❌ | `500000` | 前端 / filter | 剩余额度 |
| `fees` | object | ❌ | `{ "subscribe": 0, "redeem": 0 }` | L2 convenience | 费用结构 |
| `risk_flags` | string[] | ❌ | `["NO_POR"]` | L2 / 前端 | 风险标记 |
| `source_updated_at` | string | ❌ | `2026-04-10T09:30:00Z` | 前端 / freshness | 更新时间 |

#### `yield history` 最低字段

| 字段 | 类型 | 必填 | 示例 | 用于哪个模块 | 说明 |
|---|---|---|---|---|---|
| `ts` | string/int | ✅ | `2026-04-10` | L2 stability / 前端图表 | 时间点 |
| `apy` | number | ✅ | `0.074` | L2 stability / 前端图表 | 对应收益率 |

### 4.3 字段口径

- APR / APY 需要明确是小数还是百分比；建议统一成小数，并在前端格式化
- `lock_days = 0` 与 `null` 需区分：`0` 表示活期，`null` 表示未知
- `remaining_capacity = null` 表示平台未提供，不等于 0
- 所有时间字段统一返回 UTC ISO8601 或 Unix 毫秒，避免混用
- `platform_slug` 必须与本地 `platform_meta.yaml` / `protocol_meta.yaml` 口径一致

## 5. 数据源与刷新要求

| 数据 | 来源 | 刷新频率 | 是否需要鉴权 | fallback |
|---|---|---|---|---|
| Earn 产品池 | Antseer 聚合 / 各交易所 Earn API | ≤ 5 min | 是 | 各交易所直连 |
| 30 日收益时序 | Antseer / 各平台历史接口 | 每 5-15 min | 视来源而定 | 无则前端隐藏历史图 |
| 安全元数据 | Antseer / 本地 YAML | 每日 / 每周 | 可选 | 本地 YAML |
| Gas / 市场辅助数据 | Antseer / 链上服务 | 1-5 min | 可选 | 默认值降级 |

## 6. 鉴权 / 环境变量

```bash
# Required
ANTSEER_BASE_URL=https://api.antseer.ai/v1
ANTSEER_API_KEY=
ANTHROPIC_API_KEY=

# Optional exchange fallback
BINANCE_API_KEY=
BINANCE_SECRET=
OKX_API_KEY=
OKX_SECRET=
OKX_PASSPHRASE=
BYBIT_API_KEY=
BYBIT_SECRET=
BITGET_API_KEY=
BITGET_SECRET=
KUCOIN_API_KEY=
KUCOIN_SECRET=
GATE_API_KEY=
GATE_SECRET=
HTX_API_KEY=
HTX_SECRET=
```

## 7. 错误处理契约

| 场景 | 错误码/异常 | 前端/调用方表现 |
|---|---|---|
| 无符合条件产品 | `NO_PRODUCTS` | 显示空态，提示放宽筛选 |
| 上游超时 | `UPSTREAM_TIMEOUT` | 显示错误卡 + retry |
| 参数非法 | `INVALID_PARAMS` | 阻止提交或返回明确错误 |
| 单个平台失败 | 部分失败 | 页面可降级展示剩余平台结果 |

## 8. 前端集成契约

- 前端需要从 orchestrator 最终 JSON 中读取：`products` / `top_candidates` / `decision` / `history`
- 需要明确 loading / error / empty 状态分别依赖哪些字段
- 允许两种接线方式：
  1. 后端 API → 前端 fetch JSON
  2. Python 输出 JSON → 注入 HTML 模板
- 若历史收益时序未返回，前端必须能优雅隐藏对应图表区域

## 9. 验收标准

- [ ] Antseer 主通道能返回可映射到 `RawProduct` 的字段
- [ ] 至少 2 家 CEX + 1 个 DeFi 协议能跑通真实数据
- [ ] `tests/test_l2_scorer.py` 继续通过
- [ ] 前端至少有一条真实数据路径，不再完全依赖 mock
- [ ] 无数据、上游错误、参数错误能稳定处理
- [ ] 至少准备一组 fixture / 录制样例供回归测试

## 10. 待确认问题

- [ ] Antseer 是否提供统一 Earn 聚合接口，还是需要走多源直连
- [ ] `apr_tiers` 的标准返回格式如何定义
- [ ] L3 最终是否走 Anthropic 直连还是 Antseer 内部代理
- [ ] 缺失的 `frontend/l3-decision-prompt-tuner.html` 是否另有仓库或应从 package 中删除引用
