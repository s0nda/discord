/*
 * test.js
 */

const { HttpX } = require("../utils/httpx.js");
const { Parser } = require("../utils/parser.js");

(async (url) => {
  let data = await HttpX.get_html(url);
  //parse_html(data);
  Parser.parse(data);
  console.log("####### " + "&#160;");
})("https://de.wiktionary.org/wiki/sterilisieren");