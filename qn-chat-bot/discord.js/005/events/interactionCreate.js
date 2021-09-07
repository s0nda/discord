/*
 * interactionCreate.js
 */
module.exports = {
  name: "interactionCreate",
  execute(interaction) {
    let client = interaction.client; // get client instance
    (async interaction => {
      if ( !interaction.isCommand() ) return;
      const command = client.commands.get(interaction.commandName);
      if ( !command ) return;
      try {
          await command.execute(interaction);
      } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    })(interaction)
  },
};