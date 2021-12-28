/*
 * @file: "parser.js"
 */
const { DOMParser } = require("xmldom"); // XMLDOM

const { parse_wiktionary } = require("./parse_wiktionary.js")


// Parser object
const Parser = {
  /*
   * parse
   *
   * @params
   * 
   *    {data: string}:
   * 
   *    {options: Object}: JSON-like object with structure
   *        { 
   *          mimeType: ...,   // string
   *          lang: ...,       // string
   *          smi: ...,        // int
   *        }
   *   
   *    where
   * 
   *    - lang : language of the content to be
   *             searched.
   *               en = english, englisch
   *               de = german, deutsch
   *               vn = vietnamese, vietnamesisch
   * 
   *    - smi : Search Machine Index,
   *            is a special number that indicates
   *            which search machine/dictionary
   *            should be used.
   *            The index numbers are:
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
   */
  parse: (data, options = { mimeType: "text/xml", lang: "de", smi: 20 }) => {
    console.log(parse_wiktionary);
    // create new DOMParser
    const domParser = new DOMParser();
    // get XMLDocument after parsing
    const doc = domParser.parseFromString(data, options.mimeType);
    switch (options.smi) {
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
        parse_wiktionary(doc);
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
  },
};

module.exports.Parser = Parser;
//exports.Parser = Parser;