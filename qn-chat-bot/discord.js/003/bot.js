/*
 * bot.js
 */
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("../config.json");

// Create client (bot)
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Ready");
});

/*
client.on("interactionCreate", async interaction => {
  if ( !interaction.isCommand() ) return;
  const { commandName } = interaction; // CommandInteraction
  switch (commandName) {
    case "qping":
      await interaction.reply("Pong!");
      break;
    case "qserver":
      await interaction.reply("Server info.");
      break;
    case "quser":
      await interaction.reply("User info.");
      break;
    default:
      break;
  }
});
*/

client.on("interactionCreate", async interaction => {
  if ( !interaction.isCommand() ) return;
  const command = client.commands.get(interaction.commandName);
  if ( !command ) return;
  try {
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(token);