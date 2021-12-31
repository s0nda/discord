/*
 * @file: "q-search.js"
 * @usage:
 *    #SlashCommand:  /q-search
 *    #UserInput:      q!search
 */
const { HttpX } = require("../utils/httpx.js");
const { Parser } = require("../utils/parser.js");
const { Settings } = require("../settings.js");
const { SlashCommandBuilder, channelMention } =  require("@discordjs/builders");

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
    let search_term, search_engine, url, data, embed_obj;
    //
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
      // configure URL
      url += search_term;
    }
    //
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
      search_engine = args.split(/ +/)[0].trim().toLowerCase();
      // check if "engine" is valid, i.e. contained in "Settings.Search_Engines.Names"
      let index = Object.values(Settings.Search_Engines.Names).indexOf(search_engine);
      url = (index != -1)
            ? Object.values(Settings.Search_Engines.Urls)[index]
            : null;           
      if (url) {
        search_term = args.slice(search_engine.length).trim();   
        url += search_term;
      }
      else { // default search engine: wiktionary
        search_term = args;
        url = Settings.Search_Engines.Urls.Wiktionary + args;
      }
    }
    // server reply
    await interaction.reply(`Searching in "${search_engine}" for "${search_term}"`);
    // retrieve data (html)
    data = await HttpX.get_html(url);
    // parse data
    embed_obj = Parser.parse(data, search_term, url);
    // send result to discord channel
    interaction.channel.send({ embeds: [embed_obj] });
  },
};