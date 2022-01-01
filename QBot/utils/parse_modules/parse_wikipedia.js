/*
 * @file: "parse_wikipedia.js"
 */
const xpath = require("xpath"); // XPath
const { MessageEmbed } = require("discord.js");
const { Settings } = require("../../data/settings");

module.exports = parse_wikipedia = {
  /*
   * Name of search engine
   */
  name: Settings.Search_Engines.Names.Wikipedia,
  /*
   * Helper functions
   */
  helper: {
    /* 
     * get_text_from_node (Helper function)
     *
     * @params
     *    {node: Node}:  A specified node in DOM
     * 
     * Return the text data from the (specified) node,
     * by removing all formatting styles, tags etc.
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
    get_text_from_node: (node) => {
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
            if (e) { s += parse_wiktionary.helper.get_text_from_node(e); }
          }
        );
        return s;
      }
    },
  },  
  /*
   * parse
   *
   * @params
   *    {doc: Document}: XMLDocument object
   *    {url: string}:   URL of search engine
   *    {term: string}:  Search term
   * 
   * @return
   *    Embed object
   */
  parse: (doc, url = null, term = null) => {
    // create new embed object
    let embed_obj = new MessageEmbed()
        .setColor("#0099ff")
        .setAuthor({ name: "Wikipedia - Die freie Enzyklopädie", iconURL: "https://de.wikipedia.org/static/apple-touch/wikipedia.png" })
        .setDescription((term) ? "Suchergebnis für \"" + term + "\"" : "Suchergebnis");
        //.setThumbnail("https://de.wikipedia.org/static/images/project-logos/dewiki.png");
    // XPath query: get the "h1" tag with attribute "id='firstheading'"
    const h1_firstHeading = xpath.select("//h1[@id='firstHeading']", doc)[0];
    // XPath query: get the first "p" tag in document
    const p = xpath.select("//p[1]", doc)[0];
    // set field name & field value
    const field_name = h1_firstHeading.textContent;
    const field_value = parse_wikipedia.helper.get_text_from_node(p);
    // add new field for content to embed object
    embed_obj.addField("*\n" + field_name.toUpperCase(), field_value, false);
    // add (new) field for link to embed object
    embed_obj.addField("*\nQUELLE:", url, false);
    return embed_obj;
  },
};