const { SlashCommandBuilder } = require("discord.js");

function convertToChineseNumber(number) {
  const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const chineseUnits = ["", "十", "百", "千"];

  if (number === 0) {
    return chineseNumbers[0];
  }

  const digits = number.toString().split('').map(Number);
  const digitCount = digits.length;
  let chineseNumber = "";

  for (let i = 0; i < digitCount; i++) {
    const digit = digits[i];
    const unit = chineseUnits[digitCount - i - 1];

    if (digit !== 0) {
      // 處理 10 的特殊情况
      if (digit === 1 && i === 0 && digitCount == 2) {
        chineseNumber += unit;
      } else {
        chineseNumber += chineseNumbers[digit] + unit;
      }
    } else {
      // 避免在最高單位時添加零
      if (i !== digitCount - 1) {
        // 避免重復添加零
        let isNonZeroAhead = false;
        for (let j = i + 1; j < digitCount; j++) {
          if (digits[j] !== 0) {
            isNonZeroAhead = true;
            break;
          }
        }
        if (isNonZeroAhead) {
          chineseNumber += chineseNumbers[digit];
        }
      }
    }
  }
  return chineseNumber;
}

function convertColorToEmoji(color) {
  if (color === "B") {
    return ":black_circle:";
  } else {
    return ":white_circle:";
  }
}

let messages = [
  { // help
    "embeds": [
      {
        "type": "rich",
        "title": `黑白棋指令幫助`,
        "description": `如何在聊天室遊玩黑白棋`,
        "color": 0x21b14c,
        "fields": [
          {
            "name": `setp 1 邀請你的對手`,
            "value": `使用\`/reversi [user]\`來邀請你的對手參加對戰`
          },
          {
            "name": `step 2 等待你的對手加入`,
            "value": `當你使用指令邀請對手後，會出現對話框。\n如果你的對手在你發出邀請後的一分鐘內同一的話，你們即將開始對弈。\n如果點選不同意或是等待時間超過一分鐘，則取消對弈`
          },
          {
            "name": `step 3 開始遊戲`,
            "value": `當你的對手點擊同意對弈後，遊戲即將開始。`
          },
          {
            "name": `step4 遊戲過程`,
            "value": `直接在頻道輸入想下的位置。\n比如想下A8，就直接輸入A8或a8\n關於遊戲規則可以使用\`/reversi rule\`來了解`
          },
          {
            "name": `step 5 遊戲結束`,
            "value": `當遊戲結束後對話框會顯示贏家，並結束遊戲。`
          }
        ]
      }
    ]
  },
  {
    "embeds": [
      {
        "type": "rich",
        "title": `黑白棋的規則`,
        "description": `黑白棋規則說明`,
        "color": 0x21b14c,
        "fields": [
          {
            "name": "棋盤",
            "value": "棋盤是由8*8個格子組成，開局時，棋盤正中央的4格先置放黑白相隔的4枚棋子（亦有求變化相鄰放置）"
          },
          {
            "name": "開局",
            "value": "通常黑子先行。雙方輪流落子。"
          },
          {
            "name": "落子",
            "value": "只要落子和棋盤上任一枚己方的棋子在一條線上（橫、直、斜線皆可）夾著對方棋子，就能將對方的這些棋子轉變為己方（翻面即可）。"
          },
          {
            "name": "跳過",
            "value": "當下局者沒有合法落子位置時，則跳過該回合"
          },
          {
            "name": "結束",
            "value": "雙方都沒有棋步可下則對局結束，棋子顏色多的一方為獲勝者。通常情況下，所有的64個位置都被放上棋子，亦會有雙方都無法下的零星位置"
          }
        ]
      }
    ]
  }, // rule
  (user, invite, expired) => { // invite
    return {
      "embeds": [
        {
          "type": "rich",
          "title": `對弈邀請`,
          "description": "",
          "color": 0x21b14c,
          "fields": [
            {
              "name": "\u200B",
              "value": `${invite}你已收到來自${user}的邀請。\n如果同意他的邀請，按下[接受]來開始對弈，不同意則按下[拒絕]`
            },
            {
              "name": "\u200B",
              "value": `此邀請在<t:${expired}:R>過期`
            }
          ]
        }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "style": 3,
              "label": `接受`,
              "custom_id": `acceptReversiInvitation`,
              "disabled": false,
              "type": 2
            },
            {
              "style": 4,
              "label": `拒絕`,
              "custom_id": `declineReversiInvitation`,
              "disabled": false,
              "type": 2
            }
          ]
        }
      ]
    }
  },
  (user, invite) => { // expired
    return {
      "embeds": [
        {
          "type": "rich",
          "title": `邀請過期`,
          "description": "",
          "color": 0xb12121,
          "fields": [
            {
              "name": "\u200B",
              "value": `${invite}沒有回應${user}的邀請。`
            }
          ]
        }
      ],
      "components": []
    }
  },
  (user, invite) => { // decline
    return {
      "embeds": [
        {
          "type": "rich",
          "title": `不同意邀請`,
          "description": "",
          "color": 0xb12121,
          "fields": [
            {
              "name": "\u200B",
              "value": `${invite}拒絕${user}的邀請。`
            }
          ]
        }
      ],
      "components": []
    }
  },
  (user, invite) => { // accept
    return {
      "embeds": [
        {
          "type": "rich",
          "title": `接受邀請`,
          "description": "",
          "color": 0x21b14c,
          "fields": [
            {
              "name": "\u200B",
              "value": `對弈即將開始\n${user} vs ${invite}`
            }
          ]
        }
      ],
      "components": []
    }
  },
  (round, turn, turnColor, black, white, board) => {
    return {
      "embeds": [{
        "type": "rich",
        "title": `第${convertToChineseNumber(round)}局`,
        "description": `現在是${convertColorToEmoji(turnColor)}換${turn}下\n目前\`${black}\`個:black_circle:\`${white}\`個:white_circle:\n你必須在<t:${Math.floor(Date.now() / 1000) + 60}:R>回應`,
        "color": 0x21b14c,
        "fields": [
          {
            "name": `棋盤`,
            "value": `${board}`
          }
        ]
      }
      ]
    }
  }
]

async function game(interaction) {
  let response = await interaction.reply(messages[2](interaction.user, interaction.options.getUser("user"), Math.floor(Date.now() / 1000) + 60));
  let inviteCollectorFilter = (buttonInteraction) => { return buttonInteraction.user.id === interaction.options.getUser("user").id };
  try {
    let inviteConfirmation = await response.awaitMessageComponent({ filter: inviteCollectorFilter, time: 60000 });
    console.log(inviteConfirmation.customId === "acceptReversiInvitation");
    if (inviteConfirmation.customId === "acceptReversiInvitation") {
      await interaction.editReply(messages[5](interaction.options.getUser("user"), interaction.user));
      await gameStart();

    } else if (inviteConfirmation.customId === "declineReversiInvitation") {
      await interaction.editReply(messages[4](interaction.options.getUser("user"), interaction.user));
    }

  } catch (error) {
    console.log(error);
    await interaction.editReply(messages[3](interaction.options.getUser("user"), interaction.user));
  }

  async function gameStart() {
    let gameInfo = {
      round: 1,
      turn: interaction.user,
      turnColor: "B",
      black: 2,
      white: 2,
    }

    let board = [ // 棋盤
      ["E", "E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "W", "B", "E", "E", "E"],
      ["E", "E", "E", "B", "W", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E", "E"]
    ]

    function getBoard() { // 取得棋盤
      let boardString = "";
      boardString += "\` A  B  C  D  E  F  G  H  \`";
      for (let i = 0; i < 8; i++) {
        boardString += `\n`;
        boardString += `\`${i + 1}\``;
        for (let j = 0; j < 8; j++) {
          switch (board[i][j]) {
            case "E":
              boardString += ":green_square:";
              break;
            case "B":
              boardString += ":black_circle:";
              break;
            case "W":
              boardString += ":white_circle:";
              break
          }
        }
      }
      return boardString;
    }

    function nextRound() { // 下一回合
      gameInfo.round++;
      if (gameInfo.turnColor === "B") {
        gameInfo.turnColor = "W";
      } else {
        gameInfo.turnColor = "B";
      }
      if (gameInfo.turn === interaction.user) {
        gameInfo.turn = interaction.options.getUser("user");
      } else {
        gameInfo.turn = interaction.user;
      }

      countColor();
    }

    function countColor() { // 計算棋盤上的黑白子數量
      gameInfo.black = 0;
      gameInfo.white = 0;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (board[i][j] === "B") {
            gameInfo.black++;
          } else if (board[i][j] === "W") {
            gameInfo.white++;
          }
        }
      }
    }

    function checkCanPut(col, row) { // 檢查是否可以下在該位置
      if (board[row][col] !== "E") {
        return false;
      }

      let directions = [
        [0, 1], // 右
        [1, 1], // 右下
        [1, 0], // 下
        [1, -1], // 左下
        [0, -1], // 左
        [-1, -1], // 左上
        [-1, 0], // 上
        [-1, 1] // 右上
      ]

      for (let i = 0; i < 8; i++) {
        let combo = 0;
        let x = col;
        let y = row;

        for (let j = 0; j < 8; j++) {
          x += directions[i][0];
          y += directions[i][1];
          if (x < 0 || x > 7 || y < 0 || y > 7) {
            break;
          }
          if (board[y][x] === "E") {
            combo = 0;
            break;
          }
          if (board[y][x] === gameInfo.turnColor) {
            if (combo === 0) {
              break;
            } else {
              return true;
            }
          } else {
            combo++;
          }
        }
        if (combo != 0) {
          return true;
        }
      }

      return false;
    }

    function transform(col, row) { // 下棋

      let directions = [
        [0, 1], // 右
        [1, 1], // 右下
        [1, 0], // 下
        [1, -1], // 左下
        [0, -1], // 左
        [-1, -1], // 左上
        [-1, 0], // 上
        [-1, 1] // 右上
      ]

      for (let i = 0; i < 8; i++) {
        let combo = 0;
        let x = col;
        let y = row;

        for (let j = 0; j < 8; j++) {
          x += directions[i][0];
          y += directions[i][1];
          if (x < 0 || x > 7 || y < 0 || y > 7) {
            break;
          }
          if (board[y][x] === "E") {
            combo = 0;
            break;
          }
          if (board[y][x] === gameInfo.turnColor) {
            if (combo === 0) {
              break;
            } else {
              for (let k = 0; k < combo; k++) {
                x -= directions[i][0];
                y -= directions[i][1];
                board[y][x] = gameInfo.turnColor;
              }
              break;
            }
          } else {
            combo++;
          }
        }

        if (combo != 0) {
          for (let k = 0; k < combo; k++) {
            x -= directions[i][0];
            y -= directions[i][1];
            board[y][x] = gameInfo.turnColor;
          }
        }
      }

      board[row][col] = gameInfo.turnColor;
    }

    function checkContinue() {
      for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
          if (checkCanPut(col, row)) {
            return false;
          }
        }
      }
      return true;
    }

    function checkWinner() {
      if (gameInfo.black > gameInfo.white) {
        return "B";
      } else if (gameInfo.black < gameInfo.white) {
        return "W";
      } else {
        return "T";
      }
    }

    while (true) {
      // print board
      await interaction.channel.send(messages[6](gameInfo.round, gameInfo.turn, gameInfo.turnColor, gameInfo.black, gameInfo.white, getBoard()));
      // wait for user input
      const msg_filter = m => m.author.id === gameInfo.turn.id;
      const userMessage = await interaction.channel.awaitMessages({ filter: msg_filter, max: 1, time: 60000 });
      if (userMessage.size === 0) {
        interaction.channel.editReply("等待超時，遊戲結束");
        break
      }
      let userMessageContent = userMessage.first().content;
      // 判斷格式
      if (userMessageContent == "exit") {
        interaction.channel.editReply("遊戲結束");
        break
      } else if (userMessageContent.length != 2) {
        interaction.channel.editReply("錯誤的輸入");
        continue
      } else if (userMessageContent[0].toLowerCase().charCodeAt(0) < 97 || userMessageContent[0].toLowerCase().charCodeAt(0) > 104) {
        interaction.channel.editReply("錯誤的輸入");
        continue
      } else if (userMessageContent[1] < 1 || userMessageContent[1] > 8 || isNaN(userMessageContent[1]) || isNaN(parseInt(userMessageContent[1]))) {
        interaction.channel.editReply("錯誤的輸入");
        continue
      }

      let col = userMessageContent[0].toLowerCase().charCodeAt(0) - 97;
      let row = parseInt(userMessageContent[1]) - 1;
      if (checkCanPut(col, row)) {
        transform(col, row);
      } else {
        interaction.channel.editReply("不合法的位置");
        continue
      }

      // check continue
      if (checkContinue()) {
        // 更新遊戲 但不換人
        nextRound();
        if (checkContinue()) {
          await interaction.channel.editReply("雙方皆無法下棋，遊戲結束");
          // end game
          await interaction.channel.editReply(`遊戲結束，${checkWinner()}獲勝`);
          break
        }
        await interaction.channel.editReply("你無法下棋，換對手下棋");
        // 不換人
        if (gameInfo.turn.id == interaction.user.id) {
          gameInfo.turn = interaction.options.getUser("user");
        } else {
          gameInfo.turn = interaction.user;
        }

      } else {
        nextRound();
      }
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reversi")
    .setDescription("來場黑白棋吧！")
    .addSubcommand(subcommand =>
      subcommand
        .setName("help")
        .setDescription("如何在聊天室遊玩黑白棋")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("rules")
        .setDescription("遊戲規則")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("invite")
        .setDescription("邀請一個玩家跟你來場黑白棋")
        .addUserOption(option =>
          option
            .setName("user")
            .setDescription("邀請玩家")
            .setRequired(true)
        )
    )
  ,
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case "help":
        await interaction.reply(messages[0]);
        break;

      case "rules":
        await interaction.reply(messages[1]);

      case "invite":
        game(interaction);
        break;
    }
  }
}