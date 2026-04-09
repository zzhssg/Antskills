# SeerClaw Scanner AI Prompt Reference

## 1. Scanner Prompt

输入给模型：
- `params.coin`
- `params.timeWindow`
- `summary`
- `addresses[]`

任务：
- 解释筛选结果在做什么方向
- 给每个地址起 2-3 字中文昵称
- 输出一段 3-5 句共识分析

## 2. Output Schema

```json
{
  "description": "20-60字，客观摘要",
  "nicknames": {"0x123...": "快刀手"},
  "consensus": "3-5句，自然中文",
  "_selfScore": {"score": 82, "reason": "..."}
}
```

## 3. Writing Rules

### description
- 2-3 句
- 客观摘要
- 必须提及筛选阈值或筛选条件（如胜率门槛、仓位门槛、时间窗口）以及关键人物
- **不要给建议**

### nicknames
- 2-3 字中文
- 不可重复
- 基于风格而不是随机起名

### consensus
必须包含：
1. 多空定性
2. 关键人物（含昵称）
3. 价位区间
4. 少数派风险
5. 可操作建议

### Forbidden Style
- `首先 / 其次 / 最后 / 值得注意的是 / 总的来说`
- 报表式堆数字

## 4. Quality Bar

评分维度（各20分）：
- 信息完整性
- 昵称辨识度
- 分析深度
- 语言质量
- 风险提示

## 5. Example Input

见 `templates/scanner-ai-input.json`

## 6. Example Output

见 `templates/scanner-ai-output.json`

## 7. Self-Score & Retry Logic

- 分数低于 70 重试
- 把上次分数和原因回灌
- 最多 3 次

## 8. Validation

```bash
node scripts/validate-ai-output.js templates/scanner-ai-output.json
```
