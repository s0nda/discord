/*
 * @file: "test.js"
 */

const { HttpX } = require("../utils/httpx.js");
const { Parser } = require("../utils/parser.js");

(async (url) => {
  //let data = await HttpX.get_html(url);
  //Parser.parse(data);
  //console.log("####### " + "&#160;");
  const obj = {
    name: "XYZ",
    age: 40,
    birthday: "01.01.1970" 
  };
  for (let o in obj) {
    console.log(`${o}: ${obj[o]}`);
  }
})("https://de.wiktionary.org/wiki/sterilisieren");