# SeerClaw Scanner Prototype Notes

与 `/Users/rick/code/job/project/聪明钱 可视化skill/smart-money-tracker.html` 对齐时，需要保留这些行为：

- 首次进入可处于 **sample mode**
- sample mode 要有 watermark / banner 提示
- 点击 `开始分析` 后，本地进入 live mode
- LoadingState 在原型中是纯前端 1600ms 定时，不等于真实接口时延
- chart candles 在原型里是本地 mock 生成，不是后端真实 K 线
- Scanner chart 通过单一 coin 配置隐藏切币器
- 地址外链必须 `stopPropagation`

这些行为是原型 parity 要求，不代表生产真实数据来源。
