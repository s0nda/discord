/*
 * @file: "qserver.js"
 */
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("qserver")
        .setDescription("Replies with server info!"),
  async execute(interaction) {
    await interaction.reply(`Server name: ${interaction.guild.name}. Total member(s): ${interaction.guild.memberCount}`);
  },
};