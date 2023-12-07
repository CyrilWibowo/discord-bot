const { SlashCommandBuilder, Message } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getData, setData } = require('../../data.js');

const config = require('../../config.json')

const MAX_COMMAND_NAME_LENGTH = config.maxCommandNameLength;
const MAX_COMMAND_DESCRIPTION_LENGTH = config.maxCommandDescriptionLength;
const MAX_COMMAND_OUTPUT_LENGTH = config.maxCommandOutputLength;
const MAX_LIST_NAME_LENGTH = config.maxListNameLength;
const MAX_LIST_DESCRIPTION_LENGTH = config.maxListDescriptionLength;
const CHARACTER_LIMIT = config.maxCharacterLimit;

const dataStore = getData();
const utilityCommands = dataStore.commands.utility;
const commandNew = utilityCommands.find(obj => obj.name === 'new');

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	data: new SlashCommandBuilder()
		.setName(commandNew.name)
		.setDescription(commandNew.description)
    .addSubcommand(subcommand =>
      subcommand
        .setName(commandNew.subcommands[0].name)
        .setDescription(commandNew.subcommands[0].description)
        .addStringOption(option =>
          option
            .setName(commandNew.subcommands[0].options[0].name)
            .setDescription(commandNew.subcommands[0].options[0].description)
            .setRequired(commandNew.subcommands[0].options[0].required)
        )
        .addStringOption(option =>
          option
          .setName(commandNew.subcommands[0].options[1].name)
          .setDescription(commandNew.subcommands[0].options[1].description)
          .setRequired(commandNew.subcommands[0].options[1].required)
        )
        .addStringOption(option =>
          option
          .setName(commandNew.subcommands[0].options[2].name)
          .setDescription(commandNew.subcommands[0].options[2].description)
          .setRequired(commandNew.subcommands[0].options[2].required)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(commandNew.subcommands[1].name)
        .setDescription(commandNew.subcommands[1].description)
        .addStringOption(option =>
          option
            .setName(commandNew.subcommands[1].options[0].name)
            .setDescription(commandNew.subcommands[1].options[0].description)
            .setRequired(commandNew.subcommands[1].options[0].required)
        )
        .addStringOption(option =>
          option
          .setName(commandNew.subcommands[1].options[1].name)
          .setDescription(commandNew.subcommands[1].options[1].description)
          .setRequired(commandNew.subcommands[1].options[1].required)
        )
        .addStringOption(option =>
          option
          .setName(commandNew.subcommands[1].options[2].name)
          .setDescription(commandNew.subcommands[1].options[2].description)
          .setRequired(commandNew.subcommands[1].options[2].required)
        )
    ),
  async execute(interaction) {
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();

    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const items = interaction.options.getString('items')
    const output = interaction.options.getString('output');

    if (subcommand === 'command') {
      const result = createNewCommand(name, description, output);
      if ('error' in result) {
        // Display Error
        console.log(result.error);
        await interaction.reply({ content: result.error, ephemeral: true });
        return;
      }
      
      // Display success
      console.log(`Command ${name} successfully created!`);
      await interaction.reply(`Command ${name} successfully created!`);

    } else if (subcommand === 'list') {
      const result = createNewList(name, description, items);
      if ('error' in result) {
        // Display Error
        console.log(result.error);
        await interaction.reply({ content: result.error, ephemeral: true });
        return;
      }

      // Display success
      console.log(`List ${name} successfully created!`);
      await interaction.reply(`List ${name} successfully created!`);
    }
  },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const createNewCommand = (name, description, output) => {
  let data = getData();
  let commands = data.commands;

  if (commandNameIsUsed(name)) {
    return { error: `ERROR: Command name '${name}' has already been used` }
  } else if (name.length > MAX_COMMAND_NAME_LENGTH) {
    return { error: `ERROR: Command name must be less that ${MAX_COMMAND_NAME_LENGTH}` };
  } else if (config.reservedKeywords.includes(name)) {
    return { error: `ERROR: Cannot use reserved keyword '${name}'` };
  } else if (description.length > MAX_COMMAND_DESCRIPTION_LENGTH) {
    return { error: `ERROR: Command description must be less that ${MAX_COMMAND_DESCRIPTION_LENGTH}`}
  } else if (!isValidCommandName(name)) {
    return { error: `ERROR: Command name must only include lowercase letters, '_' or '-'` };
  } else if (output.length > MAX_COMMAND_OUTPUT_LENGTH) {
    return { error: `ERROR: Command output must be less that ${MAX_COMMAND_OUTPUT_LENGTH}` };
  } else if (name.length + output.length + description.length > CHARACTER_LIMIT) {
    return { error: `ERROR: Total characters between name, description and output ` + 
                    `cannot exceed ${CHARACTER_LIMIT}` };
  }

  // Add to data and create new command file
  commands.user.push(newCommand(name, description, output));
  data.choices.commandsUser.push(name);
  const fileContent = newCommandTemplate(name, description, output);
  const filePath = path.join(__dirname, '..', 'user', `${name}.js`);
  fs.writeFileSync(filePath, fileContent, 'utf-8');

  setData(data);
  return {};
}

const createNewList = (name, description, items) => {
  let data = getData();
  let lists = data.lists;

  if (listNameIsUsed(name)) {
    return { error: `ERROR: List name '${name}' has already been used` }
  } else if (config.reservedKeywords.includes(name)) {
    return { error: `ERROR: Cannot use reserved keyword '${name}'` };
  } else if (name.length > MAX_LIST_NAME_LENGTH) {
    return { error: `ERROR: List name must be less that ${MAX_LIST_NAME_LENGTH}` };
  } else if (description.length > MAX_LIST_DESCRIPTION_LENGTH) {
    return { error: `ERROR: List description must be less that ${MAX_LIST_DESCRIPTION_LENGTH}`}
  }

  // Split syntax into array of items
  const listItems = items.split('$').map(item => item.trim());
  lists.push(newList(name, description, listItems));
  data.choices.lists.push(name);

  setData(data);
  return {};
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const commandNameIsUsed = (name) => {
  const data = getData();
  return data.commands.user.some(obj => obj.name === name);
}

const listNameIsUsed = (name) => {
  const data = getData();
  return data.lists.some(obj => obj.name === name);
}

const isValidCommandName = (name) => {
  // Check if the name contains only lowercase letters, hyphens, and underscores
  const regex = /^[a-z_-]+$/;
  return regex.test(name);
}

const newList = (name, description, items) => {
  return {
    name: name,
    description: description,
    items: items
  }
}

const newCommand = (name, description, output) => {
  return {
    name: name,
    description: description,
    numOptions: 0,
    options: [],
    numSubcommands: 0,
    subcommands: [],
    output: output
  };
}

const newCommandTemplate = (name, description, output) => {
  return `const { SlashCommandBuilder, Message } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('${name}')
    .setDescription('${description}'),
  async execute(interaction) {
    await interaction.reply('${output}');
  },
};
  `
};
