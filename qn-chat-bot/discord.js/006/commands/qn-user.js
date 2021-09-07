/*
 * qn-user.js
 */
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("quser")
        .setDescription("Replies with user info!"),
  execute: async interaction => {
    await interaction.reply(`Your name: ${interaction.user.username}. Your tag: ${interaction.user.tag}`);
  },
};