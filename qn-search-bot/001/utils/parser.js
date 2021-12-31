/*
 * @file: "parser.js"
 */
const { DOMParser } = require("xmldom"); // XMLDOM
const { parse_wiktionary } = require("./parse_wiktionary.js")

//=========================================================================
/*
 * Parser object
 */
const Parser = {
  /*
   * parse
   *
   * @params
   *    {data: string}:
   * 
   *    {mimeType: string}:
   * 
   *    {language: string}:
   *        Language of the content to besearched.
   *          en = english, englisch
   *          de = german, deutsch
   *          vn = vietnamese, vietnamesisch
   * 
   *    {engine_index: int}:
   *        Engine Index; is a special number that
   *        indicates which search engine should be
   *        used. The index numbers are:
*            __________________________________
*            Search machine:
*              1 = google
*              2 = bing
*              3 = yahoo
*              4 = duckduckgo
*              5 = fastbot
*            __________________________________
*            Encyclopedia:
*              10 = wikipedia
*              11 = klexikon
*            __________________________________
*            Dictionary:
*              20 = wiktionary
*              21 = dwds
*              22 = duden
   * 
   * @return
   *    Embed object that contains retrieved results
   */
  parse: (data, search_term = null, url = null, engine_index = 20, language = "de", mimeType = "text/xml") => {
    // create new DOMParser
    const dom_parser = new DOMParser();
    // get XMLDocument after parsing
    const doc = dom_parser.parseFromString(data, mimeType);
    // define result embed object
    let embed_obj = null;
    switch (engine_index) {
      case 1: // google
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;
      case 11:
        break;
      case 12:
        break;
      case 13:
        break;
      case 14:
        break;
      case 15:
        break;
      case 16:
        break;
      case 17:
        break;
      case 18:
        break;
      case 19:
        break;
      case 20: // wiktionary
        embed_obj = parse_wiktionary(doc, search_term, url);
        break;
      case 21:
        break;
      case 22:
        break;
      case 23:
        break;
      case 24:
        break;
      case 25:
        break;
      case 26:
        break;
      default:
        break;
    }
    return embed_obj;
  },
};

module.exports.Parser = Parser;