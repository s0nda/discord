/*
 * @file: "q-user.js"
 * @usage:
 *    #SlashCommand:  /q-user
 *    #UserInput:      q:user
 */
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Settings } = require("../data/settings");

module.exports = {
  data: new SlashCommandBuilder()
        .setName(Settings.Commands.PREFIX_SLASH_COMMAND + Settings.Commands.user)
        .setDescription("Replies with user info!"),
  execute: async (interaction) => {
    if (interaction.type === Settings.Components.DEFAULT_INTERACTION_TYPE) {
      await interaction.reply(`Your name: ${interaction.user.username}. Your tag: ${interaction.user.tag}`);
    }
    else if (interaction.type === Settings.Components.DEFAULT_MESSAGE_TYPE) {
      const message = interaction;
      await message.reply(`Your name: ${message.author.username}. Your tag: ${message.author.tag}`);
    }
  },
};