# {{SKILL_NAME}} — SKILL.md

> 本文件是 {{SKILL_NAME}} 的主控文档。AI 和工程师都应先读本文件。

---

## §1 Scope（范围）

### 做什么
{{一句话描述核心功能}}

### 不做什么
- {{明确边界 1}}
- {{明确边界 2}}

### 用户画像
{{目标用户描述、经验水平、典型场景}}

---

## §2 Source of Truth Order（SoT 优先级）

当多个文件对同一细节有冲突时，按此顺序裁决：

```
1. 本文件 §6（Non-negotiable Rules）
2. references/business-spec.md
3. references/api-spec.md
4. references/backend-computation.md
5. references/implementation-guide.md
6. references/ai-prompts.md
7. references/viz-specs.md
8. 前端 Demo HTML（仅作视觉参考）
```

---

## §3 Package Contents（包内容）

```
{{SKILL_SLUG}}/
├── SKILL.md                    ← 你在这里
├── README.md
├── README_zh.md
├── openai.yaml
├── VERSION
├── references/
│   ├── business-spec.md
│   ├── api-spec.md
│   ├── backend-computation.md
│   ├── implementation-guide.md
│   ├── ai-prompts.md
│   ├── viz-specs.md
│   ├── prototype-notes.md
│   ├── TestSuite.md
│   └── SKILL-REVIEW.md
├── templates/
│   ├── ai-input.json
│   └── ai-output.json
├── scripts/
│   └── validate-ai-output.js
├── assets/
│   ├── icon-small.svg
│   └── icon-card.svg
└── frontend/
    └── {{SKILL_SLUG}}.html
```

---

## §4 Workflow（4 层 Pipeline）

```
L1 数据层 → L2 计算层 → L3 决策层 → L4 渲染层

L1: {{数据源简述}} → 统一 Schema
L2: 过滤 → 衍生 → 归一化 → 评分 → 排序 → 异常检测
L3: LLM 产出 headline + top_reason + risk_warning + brief
L4: 数据 + 文案 → 容器组件 → HTML
```

---

## §5 Input Contract（输入契约）

### 用户输入

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| {{field_1}} | {{type}} | {{Y/N}} | {{default}} | {{desc}} |

### 外部数据

| 数据源 | 端点 | 刷新频率 | 延迟 |
|--------|------|----------|------|
| {{source_1}} | {{endpoint}} | {{freq}} | {{latency}} |

---

## §6 Non-negotiable Rules（铁律）

1. {{规则 1 — 例：Hero 区必须有结论}}
2. {{规则 2 — 例：有推荐必须有对应风险提示}}
3. {{规则 3 — 例：不能触发交易}}
4. {{规则 4}}

---

## §7 Implementation Checklist（实现清单）

- [ ] L1: {{数据源接入完成}}
- [ ] L1: {{降级策略实现}}
- [ ] L2: {{评分算法实现 + 单测通过}}
- [ ] L3: {{Prompt 调优完成}}
- [ ] L3: {{Fallback 模板实现}}
- [ ] L4: {{前端容器实现}}
- [ ] L4: {{错误卡 + Retry 实现}}
- [ ] 全链路: {{端到端冒烟测试}}

---

## §8 Footer

- **版本**: {{VERSION}}
- **范式**: {{A 实现型 / B 规范型 / C 双模}}
- **维护者**: {{team/person}}
- **创建日期**: {{date}}
- **最后更新**: {{date}}
