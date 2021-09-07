/*
 * bot.js
 */
const Discord = require("discord.js");
require("discord-reply"); // ! IMPORTANT: For message reply

// Authentication credentials
const { token } = require("./config.json");

// Create a new client instance
//const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES // ! IMPORTANT: For message reply
  ]
});

// Set command prefix
const prefix = '!';

// Executes once
client.once("ready", () => {
  console.log("Ready!");
  console.log("Bot '" + client.user.tag + "' is running..");
});

client.on("messageCreate", async message => {
  if ( !message.content.startsWith(prefix) || message.author.bot ) return;
  // Get command
  const cmd = message.content.slice(prefix.length)
                             .split(/ +/)[0]
                             .toLowerCase();
  // Define command reply
  let msg = "";
  switch (cmd) {
    case "hello":
      msg = "Hello " + message.author.username;
      break;
    case "ping":
      msg = "Pong!";
      break;
    default:
      break;
  }
  // Send reply
  message.reply(msg);
});

client.login(token);