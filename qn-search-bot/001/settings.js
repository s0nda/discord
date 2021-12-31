/*
 * @file: "settings.js"
 * @description:
 *    Settings & configurations
 */
const Settings = {
  Commands: {
    PREFIX_SLASH_COMMAND:   "q-",
    PREFIX_DEFAULT_COMMAND: "q:",
    ping:   "ping",
    search: "search",
    server: "server",
    user:   "user",
  },
  Components: {
    DEFAULT_INTERACTION_TYPE: "APPLICATION_COMMAND",
    DEFAULT_MESSAGE_TYPE: "DEFAULT",
  },
  /*
   * Embed titles are limited to 256 characters
   * Embed descriptions are limited to 4096 characters
   * There can be up to 25 fields
   * A field's name is limited to 256 characters and its value to 1024 characters
   * The footer text is limited to 2048 characters
   * The author name is limited to 256 characters
   * The sum of all characters from all embed structures in a message must not exceed 6000 characters
   * 10 embeds can be sent per message
   * 
   * Source:
   * - https://discordjs.guide/popular-topics/embeds.html#embed-limits
   * - https://discord.com/developers/docs/resources/channel#embed-limits
   */
  Embeds: {
    FIELD_SIZE: 1024, // 1024
    TOTAL_SIZE: 1600, // 6000
  },
  Search_Engines: {
    Names: {
      DuckDuckGo: "duckduckgo",
      Wikipedia:  "wikipedia",
      Wiktionary: "wiktionary",
    },
    Urls: {
      DuckDuckGo: "https://duckduckgo.com/?q=",
      Wikipedia:  "https://de.wikipedia.org/wiki/",
      Wiktionary: "https://de.wiktionary.org/wiki/"
    }
  }
};

module.exports.Settings = Settings;