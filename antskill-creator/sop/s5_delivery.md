# S5 — 包交付

## 目标

将 S4 产出的引用文档打包为**可交付的 Skill 包**，元数据完整，可直接挂载到 Skill 商店。

## 方法论

**元数据完整 + 范式分支。** 不同范式的交付物清单不同。

## 交付物清单

### 共同必须（所有范式）

| 文件 | 用途 | 检查项 |
|------|------|--------|
| `SKILL.md` | 主控 | 8 章节齐全 |
| `README.md` | 英文概述 | 含 Quick Start |
| `README_zh.md` | 中文概述 | 含快速开始 |
| `openai.yaml` | 商店元数据 | name / description / version 齐全 |
| `VERSION` | 语义版本号 | 格式 x.y.z |
| `assets/icon-small.svg` | 小图标 | 48×48, viewBox 正确 |
| `assets/icon-card.svg` | 卡片图标 | 200×120, viewBox 正确 |

### B 规范型额外必须

| 文件 | 用途 |
|------|------|
| `references/*.md` × 8 | 引用文档 |
| `references/SKILL-REVIEW.md` | gap 分析模板（空白待填） |
| `templates/ai-input.json` | AI 输入样例 |
| `templates/ai-output.json` | AI 输出样例 |
| `scripts/validate-ai-output.js` | 输出校验脚本 |
| `frontend/skill-name.html` | Hi-Fi Demo |

### A 实现型额外必须

| 文件 | 用途 |
|------|------|
| `pipeline/l1_data/` | 数据获取代码 |
| `pipeline/l2_compute/` | 计算代码 |
| `pipeline/l3_decision/` | LLM 调用代码 |
| `tests/test_l2.py` | 单测（必须全过） |
| `data/meta.yaml` | 平台/协议元数据 |
| `frontend/skill-name.html` | 前端 |
| `docs/PRD.md` | 完整 PRD |
| `docs/TODO-TECH.md` | 技术同事待办（按 🔴🟡🟢 分级） |
| `docs/TECH-ONBOARDING.md` | 技术入门文档 |
| `HANDOFF-REVIEW.md` | 交付自查报告 |
| `.env.example` | 环境变量模板 |
| `.gitignore` | Git 忽略规则 |
| `requirements.txt` | Python 依赖 |

### C 双模 = A + B

## 打包步骤

1. 按范式检查文件完整性
2. 运行校验：
   - `python -m json.tool templates/ai-input.json`
   - `python -m json.tool templates/ai-output.json`
   - `node scripts/validate-ai-output.js`（用样例 JSON 跑一遍）
   - A/C 范式：`python -m pytest tests/`
3. **A/C 范式额外步骤**：创建 L3 Prompt 调优工具
   - 从 `templates/skeleton.html` 的 prompt tuner 模式起步
   - 至少 3 个测试场景
   - 含 Quality Checklist 自动评分
4. 压缩：`zip -r skill-name.zip skill-name/`
5. 输出到 `/mnt/user-data/outputs/`

## README 模板要求

- 第一段：一句话说清楚这个 Skill 做什么
- Quick Start：3 步能跑起来
- Architecture：一张 ASCII 图说明 4 层 Pipeline
- File Index：所有文件的一行说明
- TODO for Tech：按优先级列出技术同事要做的事

## 质量门 → 见 quality/gates.md S5 部分
