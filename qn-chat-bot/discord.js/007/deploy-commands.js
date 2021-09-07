/*
 * deploy-commands.js
 */
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
//const { clientId, guildId, token } = require("./config.json");
const { clientId, token } = require("../config.json");

// RESTful transaction
const rest = new REST({ version: '9' }).setToken(token);

// Commands to be registered
const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Deploy commands
/*
(async () => {
  try {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      console.log("Successfully registered application commands.");
  } catch (error) {
      console.error(error);
  }
})();
*/

// Deploy commands
const deploy = async (guild) => {
  try {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guild.id),
        { body: commands },
      );
      console.log(`Successfully registered application commands at server "${guild.name}" (Id: ${guild.id}).`);
  } catch (error) {
      console.error(error);
  }
};

exports.deploy = deploy;