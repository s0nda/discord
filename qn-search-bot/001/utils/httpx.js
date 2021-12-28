/*
 * @file: "httpx.js"
 */

/* 
 * StackOverflow: https://stackoverflow.com/questions/6287297/reading-content-from-url-with-node-js
 * NoveJS.org: https://nodejs.org/en/knowledge/HTTP/clients/how-to-create-a-HTTP-request/
 * NodeJS.org: (API http.request, http.get): https://nodejs.org/api/http.html
 * 
 * The only difference between http.get and http.request is
 * that http.get automatically call http.request.end() method.
 * 
 */
const HttpX = {
    /*
    * function get_url(url: string): void
    *
    * Read and return the whole html content of a website given by its URL.
    * 
    * @params
    *    {url}
    */
    get_html: (url) => {
      return new Promise((resolve, reject) => {
        const http = require("http"),
              https = require("https");
        let client = (url.trim().indexOf("https") == 0) ? https : http;
        // make http request & get response
        let request = client.request(url, (response) => {
          let data = "";
          // (another) chunk of data has been received; append it to whole "data" response
          response.on("data", (chunk) => { data += chunk; });
          // whole response has been received; forward it for further process
          response.on("end", () => resolve(data) );
          // error handling
          response.on("error", (e) => {
            console.log("! Error: " + e.message);
            reject(e);
          });
        });
        // close http request
        request.end();
      });
    },
    /*
    * function read_html(url: string): void
    *
    * Read and return the whole html content of a website given by its URL.
    * This function is an alias of httpx.get_html().
    * 
    * @params
    *    {url: string}
    */
    read_html: (url) => { HttpX.get_html(url); },
    /*
     * function this(): Object
     *
     * Return HttpX object itself
     */
    this: () => { return HttpX; },
};

/*
 * Export module
 *
 * With
 *    module.exports.<new_property_name> = <name_of_js_file | object_name>"
 * 
 * or
 *    exports.<new_property_name> = <name_of_js_file | object_name>"
 * 
 * one can:
 *    + attach / assign anything to the object "module.exports" or just "exports"
 *    + expose those things as a module for using in separate files
 * 
 * The "exports" is an object, whereas "module" is a variable.
 * 
 * Example: 
 * 
 * (I)
 *    module.exports.myProperty = HttpX;
 *    // short: exports.myProperty = HttpX;
 * 
 * It creates a new property named "myProperty" to the object "module.exports"
 * (short: "exports"), i.e.
 * 
 *    module.exports.myProperty
 *    // short: exports.myProperty
 * 
 * Then, it attaches / assigns the object "HttpX" to this "myProperty" property
 * (of object "exports"), i.e.
 * 
 *    module.exports.myProperty = HttpX;
 * 
 *    module.exports.myProperty =
 *    {
 *        get_html: [Function: get_html],
 *        read_html: [Function: read_html],
 *        this: [Function: get_this]
 *    }
 * 
 * From this point, the "HttpX" object in "httpx.js" is globally seen and accessed
 * to as "myProperty". Keep in mind, that "HttpX" is invisible for external files.
 * Only "myPropery" (that has value of "HttpX") is a global module being visible
 * for all external files.
 * 
 * If we want to use the inner functions "get_html", "read_html" etc. from an
 * external file, we have to include the "httpx.js" file first, by using
 * "require('httpx')", i.e.
 * 
 *    const myVariable = require("httpx");
 * 
 * Now, the "myVariable" is an object containing the global module "myProperty",
 * that means:
 * 
 *    const myVariable = 
 *    {
 *        myProperty:
 *        {
 *            get_html: [Function: get_html],
 *            read_html: [Function: read_html],
 *            this: [Function: get_this]
 *        }
 *    }
 * 
 * In order to use the inner functions, we have to access the outer "myProperty"
 * object first, and then the inner functions:
 * 
 *    myVariable.myProperty.get_html
 *    myVariable.myProperty.read_html
 *    myVariable.myProperty.this
 * 
 * This is not practicable, as we want to avoid the term "myProperty" in all
 * function calls. To do that, we have two possibilities:
 * 
 * (1) In the source file "httpx.js", we export by using:
 * 
 *        module.exports.myProperty = HttpX;
 * 
 *     In the external file, we surround the word "myProperty" by curly braces, i.e.
 *    
 *        const { myProperty } = require("httpx");
 * 
 * 
 * Explanation of (1):
 * 
 * (1) Take a look at the case without surrounding curly braces first:
 * 
 *     const myVariable = require("httpx");
 *     const myVariable = 
 *     {
 *        myProperty:
 *        {
 *            get_html: [Function: get_html],
 *            read_html: [Function: read_html],
 *            this: [Function: get_this]
 *        }
 *     }
 * 
 *     After using curly brace surrounding "myProperty", we get:
 * 
 * =>  const { myProperty } =
 *     {
 *            get_html: [Function: get_html],
 *            read_html: [Function: read_html],
 *            this: [Function: get_this]
 *     }
 * 
 * =>  myProperty = HttpX;
 * =>  myProperty =
 *     {
 *            get_html: [Function: get_html],
 *            read_html: [Function: read_html],
 *            this: [Function: get_this]
 *     }
 * 
 * So, we can easily access the inner functions without giving "httpx":
 * 
 *    myProperty.get_html
 *    myProperty.read_html
 *    myProperty.this
 */
module.exports.HttpX = HttpX;
//exports.HttpX = HttpX;