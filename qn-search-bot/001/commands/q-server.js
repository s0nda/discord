/*
 * @file: "q-server.js"
 * @usage:
 *    #SlashCommand:  /q-server
 *    #UserInput:      q!server
 */
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Settings } = require("../settings.js");

module.exports = {
  data: new SlashCommandBuilder()
        .setName(Settings.Commands.PREFIX_SLASH_COMMAND + Settings.Commands.server)
        .setDescription("Replies with server info!"),
  async execute(interaction) {
    await interaction.reply(`Server name: ${interaction.guild.name}. Total member(s): ${interaction.guild.memberCount}`);
    //await message.reply(`Server name: ${message.guild.name}. Total member(s): ${message.guild.memberCount}`);
  },
};