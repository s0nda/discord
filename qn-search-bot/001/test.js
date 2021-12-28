/*
 * test.js
 */
const xpath = require("xpath");
const { DOMParser } = require("xmldom");

(() => {
  const xml = '<dd><a href="/wiki/Hilfe:H%C3%B6rbeispiele" title="Hilfe:Hörbeispiele">Hörbeispiele:</a> <img alt="Lautsprecherbild" src="//upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Loudspeaker.svg/15px-Loudspeaker.svg.png" decoding="async" title="Lautsprecherbild" width="15" height="15" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Loudspeaker.svg/23px-Loudspeaker.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Loudspeaker.svg/30px-Loudspeaker.svg.png 2x" data-file-width="20" data-file-height="20" />&#160;<a href="//upload.wikimedia.org/wikipedia/commons/1/16/De-Japan.ogg" class="internal" title="De-Japan.ogg">Japan</a><sup>&#160;(<a href="/wiki/Datei:De-Japan.ogg" title="Datei:De-Japan.ogg">Info</a>)</sup>, <img alt="Lautsprecherbild" src="//upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Loudspeaker.svg/15px-Loudspeaker.svg.png" decoding="async" title="Lautsprecherbild" width="15" height="15" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Loudspeaker.svg/23px-Loudspeaker.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Loudspeaker.svg/30px-Loudspeaker.svg.png 2x" data-file-width="20" data-file-height="20" />&#160;<a href="//upload.wikimedia.org/wikipedia/commons/5/51/De-Japan2.ogg" class="internal" title="De-Japan2.ogg">Japan</a><sup>&#160;(<a href="/wiki/Datei:De-Japan2.ogg" title="Datei:De-Japan2.ogg">Info</a>)</sup></dd></dl>';
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const dl = xpath.select("//child::dl", doc)[0];
  console.log("> Log: " + dl);
  const nodes = dl.childNodes;
  console.log("> Log: " + nodes);
  return;
})();
