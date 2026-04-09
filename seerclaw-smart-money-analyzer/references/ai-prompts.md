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

任务：
- 生成 2-3 字昵称
- 用三段式叙事写人物画像
- 给出跟单建议

## 2. Output Schema

```json
{
  "nickname": "波段王",
  "narrative": "100-200字，分三段",
  "followAdvice": "50-120字，3-5句",
  "followDifficulty": "中等",
  "followGrade": "A+",
  "_selfScore": {"score": 84, "reason": "..."}
}
```

## 3. Writing Rules

### nickname
- 2-3 字中文
- 像人物标签，不像变量名

### narrative
三段式：
1. 身份画像：一句定义风格，要有画面感
2. 数据证据：把数字翻译成人话，不要报表体
3. 当前状态：近期表现 + 当前持仓 / 当前风险

### followAdvice
3-5 句，至少讲：
1. 难度 + 原因
2. 操作建议
3. 当前时机
4. 注意事项

### Difficulty / Grade
- 优先回显输入里的 `followDifficulty`
- 优先回显输入里的 `radarGrade`

### Forbidden Style
- `首先 / 其次 / 最后 / 值得注意的是 / 总的来说`
- 报表口吻
- 字段堆砌

## 4. Quality Bar

评分维度（各20分）：
- 昵称辨识度
- 叙事画面感
- 数据翻译
- 建议实用性
- 语言简洁度

## 5. Example Input

见 `templates/analyzer-ai-input.json`

## 6. Example Output

见 `templates/analyzer-ai-output.json`

## 7. Self-Score & Retry Logic

- 分数低于 70 重试
- 把上次分数和原因回灌
- 最多 3 次

## 8. Validation

```bash
node scripts/validate-ai-output.js templates/analyzer-ai-output.json
```
