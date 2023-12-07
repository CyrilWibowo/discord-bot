const { SlashCommandBuilder, Message } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getData, setData } = require('../../data.js');

const config = require('../../config.json')

const MAX_COMMAND_NAME_LENGTH = config.maxCommandNameLength;
const MAX_COMMAND_DESCRIPTION_LENGTH = config.maxCommandDescriptionLength;
const MAX_COMMAND_OUTPUT_LENGTH = config.maxCommandOutputLength;
const CHARACTER_LIMIT = config.maxCharacterLimit;

const dataStore = getData();
const utilityCommands = dataStore.commands.utility;
const commandEditCommand = utilityCommands.find(obj => obj.name === 'edit_command');

const commandChoicesArray = dataStore.choices.commandsUser;
const commandChoices = commandChoicesArray.map(choice => ({
  name: choice,
  value: choice.toLowerCase(),
}))

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	data: new SlashCommandBuilder()
		.setName(commandEditCommand.name)
		.setDescription(commandEditCommand.description)
    .addSubcommand(subcommand =>
      subcommand
        .setName(commandEditCommand.subcommands[0].name)
        .setDescription(commandEditCommand.subcommands[0].description)
        .addStringOption(option =>
          option
            .setName(commandEditCommand.subcommands[0].options[0].name)
            .setDescription(commandEditCommand.subcommands[0].options[0].description)
            .setRequired(commandEditCommand.subcommands[0].options[0].required)
            .addChoices(...commandChoices)
        )
        .addStringOption(option =>
          option
          .setName(commandEditCommand.subcommands[0].options[1].name)
          .setDescription(commandEditCommand.subcommands[0].options[1].description)
          .setRequired(commandEditCommand.subcommands[0].options[1].required)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(commandEditCommand.subcommands[1].name)
        .setDescription(commandEditCommand.subcommands[1].description)
        .addStringOption(option =>
          option
            .setName(commandEditCommand.subcommands[1].options[0].name)
            .setDescription(commandEditCommand.subcommands[1].options[0].description)
            .setRequired(commandEditCommand.subcommands[1].options[0].required)
            .addChoices(...commandChoices)
        )
        .addStringOption(option =>
          option
          .setName(commandEditCommand.subcommands[1].options[1].name)
          .setDescription(commandEditCommand.subcommands[1].options[1].description)
          .setRequired(commandEditCommand.subcommands[1].options[1].required)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(commandEditCommand.subcommands[2].name)
        .setDescription(commandEditCommand.subcommands[2].description)
        .addStringOption(option =>
          option
            .setName(commandEditCommand.subcommands[2].options[0].name)
            .setDescription(commandEditCommand.subcommands[2].options[0].description)
            .setRequired(commandEditCommand.subcommands[2].options[0].required)
            .addChoices(...commandChoices)
        )
        .addStringOption(option =>
          option
          .setName(commandEditCommand.subcommands[2].options[1].name)
          .setDescription(commandEditCommand.subcommands[2].options[1].description)
          .setRequired(commandEditCommand.subcommands[2].options[1].required)
        )
    ),
  async execute(interaction) {
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();

    const name = interaction.options.getString('command');
    const description = interaction.options.getString('new_name');
    const items = interaction.options.getString('new_description')
    const output = interaction.options.getString('new_output');

    if (subcommand === 'name') {
      const result = edit_name(command, name);
      if ('error' in result) {
        // Display Error
        console.log(result.error);
        await interaction.reply({ content: result.error, ephemeral: true });
        return;
      }
      
      // Display success


    } else if (subcommand === 'description') {
      const result = edit_description(command, description);
      if ('error' in result) {
        // Display Error
        console.log(result.error);
        await interaction.reply({ content: result.error, ephemeral: true });
        return;
      }

      // Display success
  
    } else if (subcommand === 'output') {
      const result = edit_output(command, output);
      if ('error' in result) {
        // Display Error
        console.log(result.error);
        await interaction.reply({ content: result.error, ephemeral: true });
        return;
      }

      // Display success
  
    }
  },
};

const edit_name = (command, name) => {

}

const edit_description = (command, description) => {

}

const edit_output = (command, output) => {

}