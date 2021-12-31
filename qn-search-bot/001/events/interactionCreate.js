/*
 * interactionCreate.js
 */
module.exports = {
  name: "interactionCreate",
  execute: async (interaction) => {
    if ( !interaction.isCommand() ) return;
    const client = interaction.client;
    const command = client.commands.get(interaction.commandName);
    if ( !command ) return;
    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(`Error: ${err}`);
        return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
  },
};