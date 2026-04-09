# SeerClaw Scanner AI Prompt Reference

## 1. Scanner Prompt

输入给模型：
- `params.coin`
- `params.timeWindow`
- `summary`
- `addresses[]`

要求：
- 解释这批地址在做什么方向
- 给每个地址起 2-3 字中文昵称
- 输出一段 3-5 句的共识分析

## 2. Output Schema

```json
{
  "description": "20-60字",
  "nicknames": {
    "0x123...": "快刀手"
  },
  "consensus": "3-5句，自然中文",
  "_selfScore": {
    "score": 82,
    "reason": "..."
  }
}
```

## 3. Writing Rules

- `description`：先给方向判断，再给扫描特征
- `nicknames`：不可重复，要能看出风格
- `consensus`：讲共振、分歧、风险，不要报表体
- 禁止：`首先 / 其次 / 最后 / 值得注意的是 / 总的来说`

## 4. Example Input

见 `templates/scanner-ai-input.json`

## 5. Example Output

见 `templates/scanner-ai-output.json`

## 6. Self-Score & Retry Logic

- 分数低于 70 就重试
- 把上次分数和原因追加给模型
- 最多 3 次

## 7. Validation

```bash
node scripts/validate-ai-output.js templates/scanner-ai-output.json
```
