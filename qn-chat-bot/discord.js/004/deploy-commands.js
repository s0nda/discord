/*
 * deploy-commands.js
 */
const fs = require("fs");
//const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("../config.json");

/*
const commands = [
  new SlashCommandBuilder().setName("qping").setDescription("Replies with pong!"),
  new SlashCommandBuilder().setName("qserver").setDescription("Replies with server info!"),
  new SlashCommandBuilder().setName("quser").setDescription("Replies with user info!")
]
  .map( command => command.toJSON() );
*/
const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    console.log("Successfully registered application commands.");
  }
  catch (error) {
    console.error(error);
  }
})();