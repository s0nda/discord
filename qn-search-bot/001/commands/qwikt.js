/*
 * @file: "qwikt.js"
 */
const { SlashCommandBuilder, channelMention } =  require("@discordjs/builders");
//const { MessageEmbed } = require("discord.js");
const { httpx } = require("../utils/httpx.js");

// Embed object
const embedSearchResult = {
  title: "Wiktionary",
  url: "",
  author: {
    name: "",
    icon_url: "",
    url: ""
  },
  description: "",
  fields: [
    {
      name: "Field 1",
      value: "Value 1 (Inline: False)",
      inline: false
    },
    {
      name: "Field 2",
      value: "Value 2 (Inline: True)",
      inline: true
    },
    {
      name: "Field 3",
      value: "Value 3 (Inline: True)",
      inline: true
    },
  ],
};


module.exports = {
  data: new SlashCommandBuilder()
        .setName("qwikti")
        .setDescription("Search for a term using Wiktionary."),
  execute: async interaction => {
    interaction.reply("Wiktionary");
    interaction.channel.send({ embeds: [embedSearchResult] });
  },
};