# S4 — PRD 输出

## 目标

将定稿的前端 Demo **逆向拆解**为 8 个引用文档 + 1 个 SKILL.md，覆盖每个像素的数据来源、计算逻辑和边界条件。

## 方法论

**逆向拆解法。** 从前端 Demo 的每一个可见元素出发，追溯到数据源。

```
前端可见元素
  → 这个元素显示什么数据？（viz-specs.md）
    → 这个数据怎么算出来的？（backend-computation.md）
      → 这个计算需要哪些原始数据？（api-spec.md）
        → 这些原始数据从哪获取？（api-spec.md L1 部分）
          → 如果获取失败怎么办？（implementation-guide.md）
```

## 8 个引用文档的产出顺序

**必须按此顺序写**（依赖关系）：

### 1. business-spec.md（产品契约）
- 核心概念定义
- 业务规则（筛选条件、排序逻辑、推荐数量）
- 边界条件（数据不足时怎么办、极端值怎么处理）
- 成功标准

### 2. api-spec.md（API 字段定义）
- L1 数据源清单（每个源的 endpoint、认证、频率、延迟）
- 原始数据 → 内部 Schema 的字段映射表
- 降级策略表

### 3. backend-computation.md（计算逻辑）
- L2 每一步的伪代码
- 评分公式 + 权重矩阵
- 异常检测规则
- 归一化方法

### 4. implementation-guide.md（前端 + AI 架构）
- L4 容器组件列表 + Props 定义
- 数据从 L2/L3 灌入容器的绑定流程
- Production-vs-Prototype 标注
- 降级 UI 规范
- Retry Contract 实现

### 5. ai-prompts.md（Prompt 规范）
- L3 System Prompt 完整文本
- 输入 JSON Schema
- 输出 JSON Schema
- 调用参数（model / temperature / max_tokens）
- Fallback 模板函数

### 6. viz-specs.md（可视化像素规范）
- 每个组件的像素尺寸、间距、字号
- 颜色编码规则（什么值对应什么颜色）
- 动画/过渡效果
- 响应式断点

### 7. prototype-notes.md（原型 parity）
- Demo 中哪些行为是 prototype-only
- Demo 中哪些视觉是参考标准
- 生产实现与 Demo 的已知差异

### 8. TestSuite.md（自测清单）
- 功能测试用例
- 边界条件测试
- 降级测试
- 视觉回归检查点

## 然后产出 SKILL.md

用 `templates/skill-md-template.md` 模板，填入 8 章节内容。

## 逆向拆解检查表

对 Demo 的每一个可见元素，回答以下 6 个问题：

| # | 问题 | 写入文档 |
|---|------|----------|
| 1 | 这个元素显示什么？ | viz-specs.md |
| 2 | 数据从哪来？ | api-spec.md |
| 3 | 怎么算出来的？ | backend-computation.md |
| 4 | 边界条件是什么？ | business-spec.md |
| 5 | AI 需要说什么？ | ai-prompts.md |
| 6 | 出错了怎么办？ | implementation-guide.md |

如果任何一个问题答不出来，说明需求不清楚 → 回 S1 追问。

## 质量门 → 见 quality/gates.md S4 部分
