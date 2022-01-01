/*
 * @file: "ready.js"
 */
const deployCommands = require("../deploy-commands");

module.exports = {
  name: "ready",
  once: true,
  execute: (client) => {
    // Register/deploy slash commands
    client.guilds.cache.each( async guild => {
      await deployCommands.deploy(guild);
    });
    // Run server
    console.log(`Logged in as: ${client.user.username}`);
    console.log("Ready!");
  },
};