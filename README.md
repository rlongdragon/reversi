# reversi on discord
這個專案可以讓你在discord上玩黑白棋

## 遊玩方式
### 機器人指令
| 指令 | 說明 |
| --- | --- |
| `/reversi help` | 機器人使用教學 |
| `/reversi rules` | 黑白棋教學 |
| `/reversi invite` | 邀請玩家與你對戰 |

### 開始遊戲
1. 邀請你的對手<br>
使用`/reversi invite [user]`來邀請你的對手參加對戰
2. 等待你的對手加入<br>
當你使用指令邀請對手後，會出現對話框。<br>
如果你的對手在你發出邀請後的一分鐘內同一的話，你們即將開始對弈。<br>
如果點選不同意或是等待時間超過一分鐘，則取消對弈
3. 開始遊戲<br>
當你的對手點擊同意對弈後，遊戲即將開始。
4. 遊戲過程<br>
直接在頻道輸入想下的位置。<br>
比如想下A8，就直接輸入A8或a8\n關於遊戲規則可以使用`/reversi rule`
5. 遊戲結束<br>
當遊戲結束後對話框會顯示贏家，並結束遊戲。

## 機器人架設
本專案使用node.js開發，在建置之前你需要先安裝node.js與npm<br>
本專案執行機器人建議使用PM2<br>
下面講解如何架設機器人。<br>

1. 在[config.json](./src/config.json)填入機器人資訊<br>
```javascript
{
    "token": "token",
    "clientId": "clientId",
    "guildID": "guildID"
}
```
2. 註冊指令<br>
直接執行[deploy-commands.js](/src/deploy-commands.js)
```bash
node deploy-commands.js
```
3. 執行機器人<br>
如果你是使用PM2，可以使用下面指令執行
```bash
pm2 start main.js --name reversi
```
如果你沒有使用PM2ㄋ，可以使用下面指令執行
```bash
node main.js
```
以上就是架設機器人的方法，如果有任何問題歡迎在issue提出
