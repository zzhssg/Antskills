# SeerClaw Analyzer AI Prompt Reference

## 1. Analyzer Prompt

输入给模型：
- `address`
- `profile`
- `positions`
- `radar`
- `radarScore`
- `radarGrade`
- `recentResults`
- `followDifficulty`

要求：
- 给地址起 2-3 字中文昵称
- 用叙事方式描述交易风格
- 给出跟单建议与风险边界

## 2. Output Schema

```json
{
  "nickname": "波段王",
  "narrative": "100-200字，自然分段",
  "followAdvice": "50-120字",
  "followDifficulty": "中等",
  "followGrade": "A",
  "_selfScore": {
    "score": 84,
    "reason": "..."
  }
}
```

## 3. Writing Rules

- `nickname`：要像人物标签，不像变量名
- `narrative`：先讲风格，再翻译数字，再说值不值得跟
- `followAdvice`：要有条件、有风险边界
- 禁止：报表口吻、堆字段、模板化过渡词

## 4. Example Input

见 `templates/analyzer-ai-input.json`

## 5. Example Output

见 `templates/analyzer-ai-output.json`

## 6. Self-Score & Retry Logic

- 分数低于 70 就重试
- 把上次分数和原因追加给模型
- 最多 3 次

## 7. Validation

```bash
node scripts/validate-ai-output.js templates/analyzer-ai-output.json
```
