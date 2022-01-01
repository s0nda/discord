/*
 * deploy-commands.js
 */
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, token } = require("./config.json");
const { Settings } = require("./data/settings");

// RESTful transaction
const rest = new REST({ version: '9' }).setToken(token);

// Slash commands to be registered
const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // if "command" is a slashcommand, i.e. contains prefix "q-" ==> register as slashcommand
  if (command.data.name.indexOf(Settings.Commands.PREFIX_SLASH_COMMAND) != -1) {
    commands.push(command.data.toJSON());
  }
}

// Deploy commands
const deploy = async (guild) => {
  try {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guild.id),
        { body: commands },
      );
      console.log(`Successfully registered application commands at server "${guild.name}" (Id: ${guild.id})`);
  } catch (error) {
      console.error(error);
  }
};

exports.deploy = deploy;