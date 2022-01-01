/*
 * @file: "q-s.js"
 * @usage:
 *    #SlashCommand:   None
 *    #UserInput:      q:s
 */
const { HttpX } = require("../utils/httpx");
const { Parser } = require("../utils/parser");
const { Settings } = require("../data/settings");

module.exports = {
  data: {
    name: Settings.Commands.PREFIX_DEFAULT_COMMAND + Settings.Commands.Shortcut.search.default,
  },
  execute: async (interaction) => {
    let search_term, search_engine, url = "", data, embed_obj;
    //
    // No slash command
    // Settings.Components.DEFAULT_MESSAGE_TYPE == "DEFAUT"
    //
    if (interaction.type == Settings.Components.DEFAULT_MESSAGE_TYPE) {
      const message = interaction
      const args = message.content
                  .slice(Settings.Commands.PREFIX_DEFAULT_COMMAND.length + Settings.Commands.Shortcut.search.wikipedia.length)
                  .trim();
      if ( !args || args == "" ) {
        message.reply("Nothing found. Please give a search term.");
        return;
      }
      // set url, search term & search engine
      search_term = args.trim().replace(/ +/, "_");
      search_engine = Settings.Search_Engines.Names.Wikipedia;
      url = Settings.Search_Engines.Urls.Wikipedia + search_term;
      // server reply
      await interaction.reply(`Searching in "${search_engine}" for "${search_term}"`);
      // retrieve data (html)
      data = await HttpX.get_html(url);
      // parse data
      embed_obj = Parser.parse(data, url, search_term, search_engine);
      // send result to discord channel
      interaction.channel.send({ embeds: [embed_obj] });
    }
  },
};