/*
 * @file: "parse_wiktionary.js"
 */
const xpath = require("xpath"); // XPath
const { MessageEmbed } = require("discord.js");
const { Settings } = require("../settings.js");

/*
 * help_get_text_from_node
 *
 * Helper function: return the text data from the
 * (specified) node, by removing all formatting
 * styles, tags et cetera.
 * 
 * Let the node <dd> be as follows:
 * 
 * <dd>This <de>is</de> <de>the <df>text</df></de> data</dd>
 * 
 * or:
 * 
 * <dd>
 *   This
 *   <de>is</de>
 *   <de>
 *     the
 *     <df>text</df>
 *   </de>
 *   data
 * </dd>
 * 
 * The corresponding structure tree would look like:
 * 
 *                     <dd>
 *     _________________|_________
 *    |        |        |         |
 *    |        |        |         |
 *  "This"    <de>     <de>     "data"
 *             |        |
 *             |       / \
 *            "is"  "the" <df>
 *                         |
 *                         |
 *                       "text"
 * 
 * After calling function "get_text_from_node" on
 * node "dd", the string "This is the text data"
 * should be yielded.
 */
const help_get_text_from_node = (node) => {
  if ( !node ) return "";
  if ( node.nodeName == "#text" ) { // if text-node
    return "" + node.nodeValue;
  }
  else {
    // XMLDOM: read all children of current context "node".
    const children = node.childNodes; // NodeList
    if ( !children || children.length == 0 ) return "";
    let s = ""; // string
    Array.from(children, // children: NodeList
      (e, i) => { // e: currentElement, i: currentIndex
        if (e) { s += help_get_text_from_node(e); }
      }
    );
    return s;
  }
};

/*
 * parse_wiktionary
 *
 * @params
 *    {doc}: XMLDocument object
 * 
 * @return
 *    Embed object
 */
const parse_wiktionary = (doc, search_term = null, search_url = null) => {
  // create new embed object
  let embed_obj = new MessageEmbed()
      .setColor("#0099ff")
      .setAuthor("Wikipedia - Wikiwörterbuch", "https://de.wiktionary.org/static/apple-touch/wiktionary/de.png")
      .setDescription((search_term) ? "Suchergebnis für \"" + search_term + "\"" : "Suchergebnis")
      .setThumbnail("https://de.wiktionary.org/static/apple-touch/wiktionary/de.png");
  // size of embed object
  let embed_obj_size = 0;
  // XPath query: read all "p" tags with attribute "title"
  let p_title = xpath.select("//p[@title]", doc);
  // XPath query: read all "dl" tags that are the first sibling
  //              of each "p[@style]" tag respectively.
  let dl_first = xpath.select("//p[@style]/following-sibling::dl[1]", doc);
  // iterate through "p[@style @title]" elements
  outer_loop:
  for (let i = 0, j = 0; i < p_title.length; i++, j++) {
    // get text data from each "p[@style]" node
    const field_name = help_get_text_from_node(p_title[i]);
    embed_obj_size += field_name.length;
    // XMLDOM: read all "dd" tags within a "dl" tag. Result is a NodeList.
    let dd_list = dl_first[i].getElementsByTagName("dd"); // NodeList
    // field value (string) of embed object
    let field_value = "";
    // insert new field into embed object
    embed_obj.addField("*\n" + field_name.toUpperCase(), "...", false);
    // iterate through "dd_list" and get text of each "dd" node
    for (let k = 0; k < dd_list.length; k++) {
      let node_text = help_get_text_from_node(dd_list[k]) + "\n";
      field_value += node_text;
      embed_obj_size += node_text.length;
      // Error handling: Discord allows only max size 6000 for whole embed object
      if (embed_obj_size > Settings.Embeds.TOTAL_SIZE) {
        if (search_url) embed_obj.addField("QUELLE:", search_url, false);
        break outer_loop;
      }
      // Error handling: Discord allows only max length 1024 for embed field value
      while ( field_value.length > Settings.Embeds.FIELD_SIZE ) {
        let last_index = field_value.substring(0, Settings.Embeds.FIELD_SIZE).lastIndexOf(" ");
        embed_obj.fields[j++].value = field_value.substring(0, last_index);
        field_value = field_value.substring(last_index);
        embed_obj.addField("(Fortsetzung)", "...", false); // insert new field
      }
    }
    // add (new) field to embed object
    embed_obj.fields[j].value = field_value;
  }
  return embed_obj;
};

/*
 * Export
 */
module.exports.parse_wiktionary = parse_wiktionary;