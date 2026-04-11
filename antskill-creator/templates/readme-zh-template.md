# {{SKILL_NAME}}

> {{一句话描述这个 Skill 做什么}}

## 快速开始

1. 阅读 `SKILL.md` 了解整体架构
2. 查看 `references/business-spec.md` 了解业务规则
3. 查看 `references/api-spec.md` 了解数据源需求

## 架构概览

```
┌──────────────────────────────────────────────────┐
│                   L4 渲染层                        │
│  Hero 卡片 → 图表/表格 → 信任层                     │
├──────────────────────────────────────────────────┤
│                   L3 决策层                        │
│  LLM → 核心结论 + 推荐理由 + 风险提示               │
├──────────────────────────────────────────────────┤
│                   L2 计算层                        │
│  过滤 → 衍生 → 归一化 → 评分 → 排序                 │
├──────────────────────────────────────────────────┤
│                   L1 数据层                        │
│  {{数据源 1}} → {{数据源 2}} → 统一 Schema           │
└──────────────────────────────────────────────────┘
```

## 文件索引

| 文件 | 用途 |
|------|------|
| `SKILL.md` | 主控文档（8 章节） |
| `references/business-spec.md` | 产品契约 |
| `references/api-spec.md` | API 字段定义 |
| `references/backend-computation.md` | 计算逻辑 |
| `references/implementation-guide.md` | 前端 + AI 架构 |
| `references/ai-prompts.md` | Prompt 规范 |
| `references/viz-specs.md` | 可视化规范 |
| `references/prototype-notes.md` | 原型说明 |
| `references/TestSuite.md` | 测试清单 |
| `references/SKILL-REVIEW.md` | gap 分析 |

## 技术同事待办

详见 `references/implementation-guide.md` § 生产清单。

## 许可

专有 — Antseer.ai
