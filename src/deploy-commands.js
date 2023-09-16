const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath, { withFileTypes: true }).filter(file => file.isDirectory());

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder.name);
  const indexFilePath = path.join(folderPath, 'index.js');

  if (fs.existsSync(indexFilePath)) {
    console.log(`[INFO] Loading command /${folder.name}`)
    const command = require(indexFilePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${indexFilePath} is missing a required "data" or "execute" property.`); // 載入失敗
    }
  }
}
console.log()

const rest = new REST().setToken(token);
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();