/*
 * @file: "parser.js"
 */
const fs = require("fs");
const { Collection } = require("discord.js");
const { DOMParser } = require("xmldom"); // XMLDOM
const { Settings } = require("../data/settings");

/*
 * Parser object
 */
const Parser = {
  /*
   * collection of all parsers / parse modules 
   * (wiktionary, wikipedia, duckduckgo ..)
   */
  modules: new Collection(),
  /*
   * parse
   *
   * @params
   *    {data: string}:
   *    {url: string}:      URL of search engine plus search term
   *    {term: string}:     Search term
   *    {engine: string}:   Name of search engine
   *    {language: string}: Language of the content to besearched.
   *        en = english, englisch
   *        de = german, deutsch
   *        vn = vietnamese, vietnamesisch
   * 
   *    {mimeType: string}:
   * 
   * @return
   *    Embed object that contains results
   */
  parse: (data, url = null, term = null, engine = Settings.Search_Engines.Names.Wikipedia, language = "de", mimeType = "text/xml") => {
    // create new DOMParser
    const dom_parser = new DOMParser();
    // get XMLDocument after parsing
    const doc = dom_parser.parseFromString(data, mimeType);
    // get the right parse module (wiktionary, wikipedia, duckduckgo ..)
    const parseModule = Parser.modules.get(engine);
    // obtain embed object
    const embed_obj = parseModule.parse(doc, url, term);
    return embed_obj;
  },
};

// Get all parse modules
const parseFiles = fs.readdirSync("./utils/parse_modules").filter(file => file.endsWith(".js"));
for (let file of parseFiles ) {
  const parseModule = require(`./parse_modules/${file}`);
  Parser.modules.set(parseModule.name, parseModule);
}

module.exports.Parser = Parser;