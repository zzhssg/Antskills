# DualYield · 技术同事待办清单

> 本文件是分享用摘要版；更细的实施拆分见 `docs/TODO-TECH.md`。
> 标记：🔴 阻塞上线 · 🟡 重要但可后补 · 🟢 优化项

## 一、L1 数据层

### 🔴 1.1 Antseer 主通道
- [ ] 确认 DCI 产品聚合端点
- [ ] 确认市场数据端点（K线 + 现价）
- [ ] 实现 `fetch_dci_products()` / `fetch_market()`
- [ ] 完成字段映射到统一 schema

### 🔴 1.2 Binance 接线
- [ ] 填入 API Key / Secret
- [ ] 实现 DCI 产品获取
- [ ] 实现公开 market 数据获取
- [ ] 验证签名与错误处理

### 🟡 1.3 其他 CEX
- [ ] OKX / Bybit / Bitget / KuCoin 接线
- [ ] 各家字段映射和错误处理

## 二、前端集成

### 🔴 2.1 mock → real data
- [ ] 将 `frontend/dualyield.html` 的 mock 数据替换为 `orchestrator.py` 输出
- [ ] 确定注入方式（API / 模板替换 / 其他）

## 三、运行环境

### 🟡 3.1 环境变量
- [ ] 配置 Antseer API Key
- [ ] 配置 Binance API Key / Secret
- [ ] 约定本地 / 测试 / 线上环境变量命名

### 🟡 3.2 缓存
- [ ] 引入 Redis 缓存（产品 TTL 10min，市场 TTL 1min）

## 四、算法与精度

### 🟡 4.1 波动率与市场数据
- [ ] 接入 Deribit IV，提升触达概率估算精度

### 🟢 4.2 收益逻辑细化
- [ ] 支持阶梯 APR
- [ ] 继续补 platform meta 自动更新

## 五、测试与交付

### 🟡 5.1 测试
- [ ] 保持 `tests/test_l2.py` 持续通过
- [ ] 增加 L1 fixture / integration tests
- [ ] 增加前端数据注入后的最小 E2E 验证
