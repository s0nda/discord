
/*
 * ready.js
 */
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Logges in as: ${client.user.tag}`)
    console.log("Ready!");
  }
};