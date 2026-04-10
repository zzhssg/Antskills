# DualYield

双币投档位决策助手：帮助用户在多家 CEX 双币理财产品里挑出“收益高、且大概率不被行权”的档位。

> **状态：PM 规格包 / 工程交接包**
>
> 这不是一个已经完成真实 API 联调、可直接上线的 skill，而是一个适合分享给技术同事继续开发的半成品包。

## 包内有什么

- 4 阶段 Pipeline（`L1 → L2 → L3 → L4`）
- 产品与技术文档
- 高保真前端原型
- L2 定量评分引擎
- L3 模板结论生成器
- 平台元数据
- 技术 onboarding 与待办文档

## 当前判断

### 已经比较强的部分
- L2 评分逻辑最成熟，而且有测试覆盖
- L3 模板模式已可用，不依赖 LLM 也能稳定出结论
- 前端原型已经能完整表达目标 UX
- PRD 和技术交接文档写得比较细
- 当前单测通过 `32/32`

### 明显还没做完的部分
- Antseer DCI / 市场接口契约还没锁定
- Binance 数据接线只搭了骨架
- 其他大多数 CEX connector 还是存根
- 前端还在使用 mock 数据
- 缓存与真实环境配置没有收尾

## 建议阅读顺序

1. `HANDOFF-REVIEW.md`
2. `TODO-TECH.md`
3. `docs/PRD.md`
4. `docs/TECH-ONBOARDING.md`

## 快速开始

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m unittest tests.test_l2 -v
python pipeline/orchestrator.py
```

## 目录概览

```text
dualyield/
├── SKILL.md
├── README.md
├── README.zh.md
├── HANDOFF-REVIEW.md
├── TODO-TECH.md
├── docs/
├── pipeline/
├── frontend/
├── data/
└── tests/
```

## 分享目的

这个包适合分享给技术同事，让他们拿到后能快速知道：
- 哪些逻辑已经可以直接复用
- 前端最终想长什么样
- 哪些接线还没完成
- 下一步应该从哪里接着做
