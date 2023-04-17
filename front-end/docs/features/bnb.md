## On init page
- I get **positions**, **open orders** base on **symbol** and **usdt balance**.
- I setup websocket to listen on `ORDER_TRADE_UPDATE`, `CANCELED`, `TRADE` events.
  - `ORDER_TRADE_UPDATE`: parse the event message and add it to **open orders**
  - `CANCELED`: get `orderId` from the event message then remove it from **open orders**
