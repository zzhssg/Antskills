# SeerClaw Analyzer Prototype Notes

与 `/Users/rick/code/job/project/聪明钱 可视化skill/smart-money-tracker.html` 对齐时，需要保留这些行为：

- 首次进入可处于 sample mode
- LoadingState 在原型里是纯前端 1600ms 定时
- 原型里 difficulty / grade 可能是硬编码 sample 值，生产版必须改为数据驱动
- 原型里 Suggested Size 可能只按首仓位 × 2% 算；生产版要补无持仓 fallback
- 原型里 row hover 可能只有高亮，无图表联动；生产版要补联动
- A2 footer 在原型里可能缺 available balance；生产版要补齐
- 地址非法禁用按钮是 PRD 要求，原型可能未实现，生产版必须实现

这些行为是原型 parity 要求，不代表最终生产实现可省略对应数据逻辑。
