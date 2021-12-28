/*
 * messageCreate.js
 */
const _PREFIX_ = "!q";

module.exports = {
  name: "messageCreate",
  execute: async (message) => {
    if ( !message.content.startsWith(_PREFIX_) || message.author.bot ) return;
    const command = message.content.slice(_PREFIX_.length)
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
      case "wikt": // wiktionary        
        break;
      default:
        break;
    }
  },
};