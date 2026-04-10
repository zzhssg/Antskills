# DualYield · 技术接口与数据提需

> 这份文档给技术同学阅读。目的不是重复 PRD，而是把“现在产品做到哪了”和“还需要哪些接口/数据实现”讲清楚。

## 1. 当前产品现状

### 已经完成 / 可复用
- 产品定位、用户画像、组件结构、公式都已写进 `docs/PRD.md`
- `pipeline/l2_compute/` 已实现 TA、到达概率、评分、风险过滤、排序、异常检测
- `pipeline/l3_decision/decision.py` 已有模板模式，不依赖 LLM 也能稳定出一句话结论
- `frontend/dualyield.html` 已有完整高保真前端原型
- `tests/test_l2.py` 当前通过 `32/32`

### 仍是 mock / stub / PRD 的部分
- `pipeline/l1_data/sources/antseer.py` 仍是存根
- `pipeline/l1_data/sources/binance.py`、`cex_others.py` 的真实 HTTP 接线尚未完成
- 前端仍在使用 mock 数据，未接 orchestrator 输出
- Redis 缓存、环境变量与部署方式未收口
- Deribit IV 尚未接入

## 2. 目标用户流

```text
用户选择 intent / underlying / principal / durations / risk
→ L1 获取双币投产品 + 市场数据 + 波动率数据
→ L2 计算 touch probability、评分、排序、top3
→ L3 生成一句话结论
→ L4 渲染 DualYield HTML
```

## 3. 需要技术实现的接口清单

| 优先级 | 接口 | 方法 | 用途 | 阻塞模块 | 状态 |
|---|---|---|---|---|---|
| P0 | `/api/v1/dci/products` | GET | 聚合 CEX DCI / 双币投产品 | L1 / L2 / 前端主列表 | 未实现 |
| P0 | `/api/v1/market/{underlying}` | GET | 现价 + K线 + 必要市场信息 | L1 / TA / 前端图表 | 未实现 |
| P1 | Binance DCI 官方接口 | GET | fallback 直连 | L1 fallback | scaffold only |
| P1 | OKX / Bybit / Bitget / KuCoin DCI 接口 | GET/POST | fallback 直连 | L1 fallback | stub |
| P1 | Deribit IV | GET | 提升触达概率精度 | L2 probability | 未实现 |
| P1 | Redis 缓存层 | internal | 产品 / 市场缓存 | runtime / performance | 未实现 |

## 4. 数据 Schema 提需

### 4.1 请求参数

#### `/api/v1/dci/products`

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `underlyings` | string[] / csv | ✅ | `BTC,ETH` | 标的资产列表 |
| `venues` | string[] / csv | ❌ | `binance,okx,bybit` | 平台范围 |
| `durations` | int[] / csv | ❌ | `7,14,30` | 可选过滤 |

#### `/api/v1/market/{underlying}`

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `candles` | string / csv | ❌ | `1h,1d` | 需要哪些周期 |
| `days` | int | ❌ | `180` | 历史窗口长度 |

### 4.2 响应字段

#### DCI 产品最低统一 schema

| 字段 | 类型 | 必填 | 示例 | 用于哪个模块 | 说明 |
|---|---|---|---|---|---|
| `product_id` | string | ✅ | `binance_btc_sell_87100_1d` | 全链路 | 全局唯一 id |
| `platform` | string | ✅ | `Binance` | 前端 / 排序 | 平台名 |
| `platform_id` | string | ✅ | `binance` | metadata / tier | 稳定机器可读 id |
| `underlying` | string | ✅ | `BTC` | 筛选 / 前端 | 标的 |
| `side` | string | ✅ | `buy_low` / `sell_high` | L2 / 前端 | 方向 |
| `strike` | number | ✅ | `87100` | L2 / 前端 | 执行价 |
| `duration` | int | ✅ | `7` | L2 / 前端 | 天数 |
| `apr` | number | ✅ | `18.5` | L2 / 前端 | 百分比数值 |
| `minAmt` | number | ❌ | `100` | 前端详情 | 最低投入 |
| `autoCompound` | boolean | ❌ | `true` | 前端详情 | 是否复投 |
| `earlyExit` | boolean | ❌ | `true` | 前端详情 | 是否支持提前退出 |
| `settlement` | string | ❌ | `T+0` | 前端详情 | 到账时效 |
| `fee` | string/number | ❌ | `无` / `0.1%` | 前端详情 | 费用 |

#### market / TA 所需字段

| 字段 | 类型 | 必填 | 示例 | 用于哪个模块 | 说明 |
|---|---|---|---|---|---|
| `spot_price` | number | ✅ | `84500` | touch probability / 前端 | 当前价 |
| `candles_1h` | Candle[] | ❌ | `[{ts,o,h,l,c,v}]` | 波动率 / 图表 | 1h K 线 |
| `candles_1d` | Candle[] | ✅ | `[{ts,o,h,l,c,v}]` | TA / 图表 | 日线 |
| `iv_annual` | number | ❌ | `0.58` | probability | 年化隐含波动率 |

### 4.3 字段口径

- `apr` 当前 PRD 用百分比数值，例如 `18.5`，不要改成小数 `0.185`，除非全链路一起统一
- `side` 必须与 L2 schema 保持一致：`buy_low` / `sell_high`
- `strike` 使用 USD 数值，不要混入字符串 `$87,100`
- K 线时间统一 UTC，避免前端自己猜时区
- 如果 `iv_annual` 缺失，可先 fallback 到历史波动率，但需明确标记来源

## 5. 数据源与刷新要求

| 数据 | 来源 | 刷新频率 | 是否需要鉴权 | fallback |
|---|---|---|---|---|
| DCI 产品列表 | Antseer / 各交易所 DCI API | ≤ 5 min | 是 | 各交易所直连 |
| 现货价 | Antseer / Binance public | 1 min | 否 | Binance public |
| K线数据 | Antseer / Binance public | 1-5 min | 否 | Binance public |
| IV 数据 | Deribit | 1-5 min | 否 | 历史波动率 |
| 平台元数据 | 本地 YAML / 后续自动更新 | 日级 | 否 | 本地 YAML |

## 6. 鉴权 / 环境变量

```bash
# Antseer
ANTSEER_BASE_URL=https://api.antseer.ai/v1
ANTSEER_API_KEY=

# Binance
BINANCE_API_KEY=
BINANCE_SECRET=

# Optional fallback venues
OKX_API_KEY=
OKX_SECRET=
OKX_PASSPHRASE=
BYBIT_API_KEY=
BYBIT_SECRET=
BITGET_API_KEY=
BITGET_SECRET=
KUCOIN_API_KEY=
KUCOIN_SECRET=

# Cache
REDIS_URL=
```

## 7. 错误处理契约

| 场景 | 错误码/异常 | 前端/调用方表现 |
|---|---|---|
| 无产品可推荐 | `NO_MATCHING_PRODUCTS` | 提示用户放宽风险或增加期限 |
| 上游失败 | `UPSTREAM_ERROR` | 显示错误态并支持 retry |
| 参数非法 | `INVALID_PARAMS` | 表单侧阻止提交 / 后端返回明确错误 |
| 部分平台失败 | partial failure | 保留可用平台结果，并标记数据不完整 |

## 8. 前端集成契约

- `frontend/dualyield.html` 需要从 orchestrator 最终 JSON 读取：`user`、`ta`、`top3`、`decision`
- 若要显示“全部档位列表”，还需要补充 `all_products` 或 `grouped_products` 输出字段
- 当前高保真原型中的卡片、排序、展开行都依赖结构化 JSON，不能只返回一句话结论
- mock 数据切换为真实数据时，需要同时验证：空态、加载态、错误态、排序切换、展开详情

## 9. 验收标准

- [ ] Antseer 或 fallback 至少能返回一个标的的完整 DCI 产品列表
- [ ] `tests/test_l2.py` 继续通过 `32/32`
- [ ] orchestrator 能跑通到 `phase=done`
- [ ] 前端首屏可显示真实 `top3` 和 `decision`
- [ ] 图表区能消费真实 K 线 / TA 数据
- [ ] 至少有一组 fixture 或录制响应供回归测试

## 10. 待确认问题

- [ ] Antseer 是否已有 DCI 聚合端点，还是要优先直连 Binance/OKX
- [ ] 前端“全部档位列表”最终由后端直接返回 grouped 数据，还是前端自行分组
- [ ] L3 是否长期保持模板模式，还是后续接 LLM 增强版
- [ ] platform_meta 后续是否需要从外部自动刷新，而不是纯手工维护
