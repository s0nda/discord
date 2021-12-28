/*
 * @file: "parse_wiktionary.js"
 */
const xpath = require("xpath"); // XPath

/*
 * get_text_data_from_node
 *
 * Return the text data from the (specified) node,
 * by removing all formatting styles, tags et cetera.
 * 
 * Let the node be:
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
 * After calling function "get_text_data_from_node"
 * on node "dd", the string "This is the text data"
 * is yielded.
 */
const get_text_data_from_node = (node) => {
  if ( !node ) return;
  if ( node.nodeName == "#text" ) { // if text-node
    return "" + node.nodeValue;
  }
  else {
    // XMLDOM: read all children of current context "node".
    const children = node.childNodes; // NodeList
    if ( !children || children.length == 0 ) return;
    let s = ""; // string
    Array.from(children,
      (e, i) => { // e: currentElement, i: currentIndex
        if ( e ) {
          s += get_text_data_from_node(e);
        }
      }
    );
    return s;
  }
};

/*
 * parse_wiktionary
 *
 * @params:
 *    doc : XMLDocument object
 */
const parse_wiktionary = (doc) => {
  // create new DOMParser
  //const parser = new DOMParser();
  // get XMLDocument after parsing
  //const doc = parser.parseFromString(string, "text/xml");
  // XPath query: read all "p" tags with attribute "title"
  let _p_ = xpath.select("//p[@style]", doc);
  // XPath query: read all "dl" tags that are the first sibling
  //              of each "p[@style]" tag respectively.
  let _dl_ = xpath.select("//p[@style]/following-sibling::dl[1]", doc);
  // print results
  for (let i = 0; i < _p_.length; i++) {
    // get child (text) nodes of each "p"
    let s = get_text_data_from_node(_p_[i]);
    console.info(`\n${s}`);
    // XMLDOM: read all "dd" tags within a "dl" tag. Result is a NodeList.
    let _dd_ = _dl_[i].getElementsByTagName("dd"); // NodeList
    Array.from(_dd_ /* array-like NodeList */, 
      (e, j) => { // e: currentElement, j: currentIndex
        s = get_text_data_from_node(e);
        console.info(`  ${s}`);
      }, 'myThisArg'
    );
  }
};

module.exports.parse_wiktionary = parse_wiktionary;
//exports.parse_wiktionary = parse_wiktionary;