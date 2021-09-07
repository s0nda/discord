/*
 * messageCreate.js
 */
module.exports = {
  name: "messageCreate",
  execute: async (message) => {
    const prefix = "!q";
    if ( !message.content.startsWith(prefix) || message.author.bot ) return;
    const command = message.content.slice(prefix.length)
                                   .trim()
                                   .split(/ +/)[0]
                                   .toLowerCase();
    if ( !command || command == "" ) return;
    switch (command) {
      case "ping":
        await message.reply("Pong!");
        break;
      case "server":
        await message.reply(`Server name: ${message.guild.name}. Total member(s): ${message.guild.memberCount}`);
        break;
      case "user":
        await message.reply(`Your name: ${message.author.username}. Your tag: ${message.author.tag}`);
        break;
      default:
        break;
    }
  },
};