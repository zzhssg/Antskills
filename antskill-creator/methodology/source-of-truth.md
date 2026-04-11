# Source of Truth (SoT) 优先级机制

## 问题

一个 Skill 包里有 10+ 个文件，不同文件可能对同一个细节有不同描述。例如：
- `business-spec.md` 说「推荐产品最多 5 个」
- `viz-specs.md` 说「推荐卡片只有 3 个槽位」
- 前端 Demo 里实际渲染了 4 个

谁对？

## 裁决规则

当多个文件对同一细节有冲突时，按以下优先级裁决（从高到低）：

```
1. SKILL.md §6（Non-negotiable Rules）
2. references/business-spec.md
3. references/api-spec.md
4. references/backend-computation.md
5. references/implementation-guide.md
6. references/ai-prompts.md
7. references/viz-specs.md
8. 前端 Demo HTML（仅作视觉参考，不是 SoT）
```

**核心规则**：高层级文件定义「是什么」，低层级文件定义「怎么做」。当两者冲突时，「是什么」优先。

## 实操指南

### 写文档时

1. **business-spec.md** 定义业务规则（最多推荐几个、什么条件筛除、风险提示必须包含什么）
2. **api-spec.md** 定义字段名和类型，必须与 business-spec 一致
3. **backend-computation.md** 定义算法，输入输出必须与 api-spec 一致
4. **viz-specs.md** 定义视觉呈现，维度必须与 business-spec 一致

### 发现冲突时

1. 找到两个冲突的文件
2. 查优先级表，以高优先级文件为准
3. 修改低优先级文件使之一致
4. 在 SKILL-REVIEW.md 的 gap 矩阵中记录这次修正

### S6 Review 时

逐字段对照引用文档，任何不一致都记录到 SKILL-REVIEW.md 的差距矩阵。

## Package Precedence Rule

**包内文件的权威性 > 人类口头说明 > Claude 的记忆**

如果用户口头说了一个规则，但包内文件没有记录 → 立即写入对应的引用文档。
如果 Claude "记得"某个规则，但包内找不到 → 视为不存在，需要向用户确认。
