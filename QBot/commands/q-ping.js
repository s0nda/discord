/*
 * @file: "q-ping.js"
 * @usage:
 *    #SlashCommand:  /q-ping
 *    #UserInput:      q:ping
 */
const { SlashCommandBuilder } =  require("@discordjs/builders");
const { Settings } = require("../data/settings");

module.exports = {
  data: new SlashCommandBuilder()
        .setName(Settings.Commands.PREFIX_SLASH_COMMAND + Settings.Commands.ping)
        .setDescription("Replies with Pong!"),
  execute: async interaction => {
    await interaction.reply("Pong!");
    //await message.reply("Pong!");
  },
};