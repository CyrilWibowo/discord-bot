const { SlashCommandBuilder, Message } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getData, setData } = require('../../data.js');

const dataStore = getData();
const utilityCommands = dataStore.commands.utility;
const commandDelete = utilityCommands.find(obj => obj.name === 'delete');

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	data: new SlashCommandBuilder()
		.setName(commandDelete.name)
		.setDescription(commandDelete.description)
    .addSubcommand(subcommand =>
      subcommand
        .setName(commandDelete.subcommands[0].name)
        .setDescription(commandDelete.subcommands[0].description)
        .addStringOption(option =>
          option
            .setName(commandDelete.subcommands[0].options[0].name)
            .setDescription(commandDelete.subcommands[0].options[0].description)
            .setRequired(commandDelete.subcommands[0].options[0].required)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
      .setName(commandDelete.subcommands[1].name)
      .setDescription(commandDelete.subcommands[1].description)
      .addStringOption(option =>
        option
          .setName(commandDelete.subcommands[1].options[0].name)
          .setDescription(commandDelete.subcommands[1].options[0].description)
          .setRequired(commandDelete.subcommands[1].options[0].required)
        )
    ),
  async execute(interaction) {
    // // Get subcommand
    const subcommand = interaction.options.getSubcommand();
    const nameString = interaction.options.getString('names');
    const names = nameString.split('$').map(item => item.trim());

    if (subcommand === 'command') {
      const result = deleteCommand(names);
      if ('error' in result) {
        // Display Error
        console.log(result.error);
        await interaction.reply({ content: result.error, ephemeral: true });
        return;
      }

      // Display Success
      console.log(`Successfully deleted commands ${names.join(",")}.`);
      await interaction.reply({ content: `Successfully deleted commands ${names.join(",")}.`, ephemeral: true });
      return;

    } else if (subcommand === 'list') {
      const result = deleteList(names);
      if ('error' in result) {
        // Display Error
        console.log(result.error);
        await interaction.reply({ content: result.error, ephemeral: true });
        return;
      }
    }
  },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const deleteCommand = (names) => {
  let data = getData();
  let commands = data.commands;
  const directoryPath = path.join(__dirname, '..', 'user');

  // Check for ALL
  if (names.length === 1 && names[0] === 'ALL') {
    commands.user = [];

    clearDirectory(directoryPath)

    setData(data);
    return {};
  }

  // Find if any command names do not exist
  let nonexistentNames = names.filter(name => !commands.user.some(obj => obj.name === name));
  if (nonexistentNames.length > 0) {
    const error = `Cannot find commands ${nonexistentNames.join(",")}.`;
    return { error: error };
  }

  // Remove files and filter commands.user
  const filteredArray = commands.user.filter(obj => !names.includes(obj.name));
  commands.user = filteredArray;
  for (const name of names) {
    const filePath = path.join(directoryPath, `${name}.js`);
    fs.unlinkSync(filePath);
  }

  setData(data);
  return {};
}

const deleteList = (names) => {
  let data = getData();
  let lists = data.lists;

  // Check for ALL
  if (names.length === 1 && names[0] === 'ALL') {
    lists = [];
    setData(data);
    return {};
  }

  // Find if any lists names do not exist
  let nonexistentNames = names.filter(name => !lists.some(obj => obj.name === name));
  if (nonexistentNames.length > 0) {
    const error = `Cannot find lists ${nonexistentNames.join(",")}.`;
    return { error: error };
  }

  const filteredArray = lists.filter(obj => !names.includes(obj.name));
  lists = filteredArray;

  setData(data);
  return {}
}

const clearDirectory = (directoryPath) => {
  // Read the contents of the directory
  const files = fs.readdirSync(directoryPath);

  // Iterate over the files and delete them
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    fs.unlinkSync(filePath);
  }
}
