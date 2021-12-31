/*
 * @file: "messageCreate.js"
 */
const fs = require("fs");
const { Settings } = require("../settings.js");

module.exports = {
  name: "messageCreate",
  execute: async (message) => {
    if ( !message.content.startsWith(Settings.Commands.PREFIX_DEFAULT_COMMAND) || message.author.bot ) return;
    const command = message.content.slice(Settings.Commands.PREFIX_DEFAULT_COMMAND.length)
                                   .trim()
                                   .split(/ +/)[0]
                                   .toLowerCase();
    if ( !command || command == "" ) return;
    //
    // The commands are stored in array "client.commands" (see "bot.js").
    // With "message.client.commands" we can access them.
    // Each of those commands has structure of slash command, e.g. "q-ping",
    // as follows:
    // 
    // cmd = 
    //    [
    //      'q-ping',
    //      {
    //        data: SlashCommandBuilder {
    //          options: [],
    //          name: 'q-ping',
    //          description: 'Replies with Pong!',
    //          defaultPermission: undefined
    //        },
    //        execute: [AsyncFunction: execute]
    //      }
    //    ]
    //
    // Let say, command "cmd" has the above structure (array).
    // To access to the execute function, we do:
    //
    //    cmd[1].execute
    //
    for (let cmd of message.client.commands) { // slash command
      const cmd_name = cmd[0].substring(Settings.Commands.PREFIX_SLASH_COMMAND.length);
      const cmd_execute = cmd[1].execute;
      if (cmd_name === command) {
        await cmd_execute(message);
        break;
      }
    }
  },
};