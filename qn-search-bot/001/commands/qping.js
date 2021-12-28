/*
 * @file: "qping.js"
 */
const { SlashCommandBuilder } =  require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("qping")
        .setDescription("Replies with Pong!"),
  execute: async interaction => {
    interaction.reply("Pong!");
  },
};