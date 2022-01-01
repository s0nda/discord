/*
 * @file: "q-search.js"
 * @usage:
 *    #SlashCommand:  /q-search
 *    #UserInput:      q:search
 */
const { HttpX } = require("../utils/httpx");
const { Parser } = require("../utils/parser");
const { Settings } = require("../data/settings");
const { SlashCommandBuilder } =  require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
        .setName(Settings.Commands.PREFIX_SLASH_COMMAND + Settings.Commands.search)
        .setDescription("Search for a term using Wiktionary.")
        .addSubcommand(
            subcommand => subcommand
                          .setName(Settings.Search_Engines.Names.DuckDuckGo)
                          .setDescription("Search in DuckDuckGo.")
                          .addStringOption(option => option.setName("term").setDescription("Your search term.").setRequired(true))
        )
        .addSubcommand(
          subcommand => subcommand
                        .setName(Settings.Search_Engines.Names.Wikipedia)
                        .setDescription("Search in Wikipedia.")
                        .addStringOption(option => option.setName("term").setDescription("Your search term.").setRequired(true))
        )
        .addSubcommand(
          subcommand => subcommand
                        .setName(Settings.Search_Engines.Names.Wiktionary)
                        .setDescription("Search in Wiktionary.")
                        .addStringOption(option => option.setName("term").setDescription("Your search term.").setRequired(true))
        ),
  execute: async (interaction) => {
    let search_term, search_engine, url = "", data, embed_obj;
    //
    // Slash command
    // Settings.Components.DEFAULT_INTERACTION_TYPE == "APPLICATION_COMMAND"
    //
    if (interaction.type == Settings.Components.DEFAULT_INTERACTION_TYPE) { // if (interaction.isCommand()) {
      //
      // The "interaction.options" is an "CommandInteractionOptionResolver" object and
      // has following structure:
      //
      //    CommandInteractionOptionResolver {
      //        _group: null,
      //        _subcommand: 'wiktionary',
      //        _hoistedOptions: [ { name: '<name>', type: 'STRING', value: '<input_term>' } ]
      //    }
      //
      search_engine = interaction.options.getSubcommand() // interaction.options._subcommand
      search_term = interaction.options._hoistedOptions[0].value;
      // iterate through object properties with for-in
      for (let engine in Settings.Search_Engines.Names) {
        if (search_engine == Settings.Search_Engines.Names[engine]) {
          url = Settings.Search_Engines.Urls[engine];
          break;
        }
      }
    }
    //
    // No slash command
    // Settings.Components.DEFAULT_MESSAGE_TYPE
    //
    else if (interaction.type == Settings.Components.DEFAULT_MESSAGE_TYPE) {
      const message = interaction
      const args = message.content
                  .slice(Settings.Commands.PREFIX_DEFAULT_COMMAND.length + Settings.Commands.search.length)
                  .trim();
      if ( !args || args == "" ) {
        message.reply("Nothing found. Please give a search term.");
        return;
      }
      // get name of search engine
      search_engine = "" + args.split(/ +/)[0].trim().toLowerCase();
      // check if "search_engine" string is valid, i.e. contained in "Settings.Search_Engines.Names"
      let index = Object.values(Settings.Search_Engines.Names).indexOf(search_engine);
      // set url, search term & search engine
      if (index != -1) { // search engine is found
        search_term = args.slice(search_engine.length).trim();
        url = Object.values(Settings.Search_Engines.Urls)[index];
      }
      else { // unknown search engine or there's no search engine => default: Wikipedia
        search_term = args.trim();
        url = Settings.Search_Engines.Urls.Wikipedia;
        search_engine = Settings.Search_Engines.Names.Wikipedia;
      }
    }
    // configure search term & url
    switch (search_engine) {
      case Settings.Search_Engines.Names.DuckDuckGo:
        search_term = search_term.replace(/ +/, "+");
        break;
      case Settings.Search_Engines.Names.Wikipedia:
        search_term = search_term.replace(/ +/, "_");
        break;
      default:
        break;
    }
    url += search_term;
    // server reply
    await interaction.reply(`Searching in "${search_engine}" for "${search_term}"`);
    // retrieve data (html)
    data = await HttpX.get_html(url);
    // parse data
    embed_obj = Parser.parse(data, url, search_term, search_engine);
    // send result to discord channel
    interaction.channel.send({ embeds: [embed_obj] });
  },
};