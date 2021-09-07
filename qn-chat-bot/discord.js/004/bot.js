/*
 * bot.js
 */
const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const { token } = require("../config.json");
const { execute } = require("./commands/qn-ping");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`Logged in as: ${client.user.tag}`);
  console.log("Ready!");
});

client.on("interactionCreate", async interaction => {
  if ( !interaction.isCommand() ) return;
  //const { commandName } = interaction;
  const command = client.commands.get(interaction.commandName);
  if ( !command ) return;
  /*
  switch ( commandName ) {
    case "qping":
      await interaction.reply("Pong!");
      break;
    case "qserver":
      await interaction.reply(`Server name: ${interaction.guild.name}. Total members: ${interaction.guild.memberCount}`);
      break;
    case "quser":
      await interaction.reply(`Your tag: ${interaction.user.tag}. Your id: ${interaction.user.id}`);
      break;
    default:
      break;
  }*/
  try {
      await command.execute(interaction);
  } catch (error) {
      console.error(error);
      return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
  }
});

client.login(token);
