/*
 * qn-user.js
 */
const { SlashCommandBuilder } = require("@discordjs/builders");
const { execute } = require("./qn-ping");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("quser")
        .setDescription("Replies with user info!"),
  async execute(interaction) {
    await interaction.reply(`Your tag: ${interaction.user.tag}. Your id: ${interaction.user.id}`);
  },
}