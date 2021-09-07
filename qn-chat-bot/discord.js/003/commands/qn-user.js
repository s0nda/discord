/*
 * ./commands/qn-user.js
 */
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("quser")
        .setDescription("Replies with user info!"),
  async execute(interaction) {
    await interaction.reply("User info.");
  },
};