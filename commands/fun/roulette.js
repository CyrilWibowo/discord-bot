const { Client, Interaction, SlashCommandBuilder, Message, 
  EmbedBuilder, RoleSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getData, setData } = require('../../data.js');
const wait = require('node:timers/promises').setTimeout;

const dataStore = getData();
const funCommands = dataStore.commands.fun;
const commandRoulette = funCommands.find(obj => obj.name === 'roulette');

const config = require('../../config.json');

const rolesChoicesArray = dataStore.roles;
const roleChoices = rolesChoicesArray.map(role => ({
  name: role.name,
  value: role.name.toLowerCase(),
}))


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


module.exports = {
	data: new SlashCommandBuilder()
		.setName(commandRoulette.name)
		.setDescription(commandRoulette.description)
    .addSubcommand(subcommand =>
      subcommand
        .setName(commandRoulette.subcommands[0].name)
        .setDescription(commandRoulette.subcommands[0].description)
        .addStringOption(option =>
          option
            .setName(commandRoulette.subcommands[0].options[0].name)
            .setDescription(commandRoulette.subcommands[0].options[0].description)
            .setRequired(commandRoulette.subcommands[0].options[0].required)
            .addChoices(...roleChoices)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(commandRoulette.subcommands[1].name)
        .setDescription(commandRoulette.subcommands[1].description)
        .addStringOption(option =>
          option
            .setName(commandRoulette.subcommands[1].options[0].name)
            .setDescription(commandRoulette.subcommands[1].options[0].description)
            .setRequired(commandRoulette.subcommands[1].options[0].required)
            .addChoices(...roleChoices)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(commandRoulette.subcommands[2].name)
        .setDescription(commandRoulette.subcommands[2].description)
        .addStringOption(option =>
          option
            .setName(commandRoulette.subcommands[2].options[0].name)
            .setDescription(commandRoulette.subcommands[2].options[0].description)
            .setRequired(commandRoulette.subcommands[2].options[0].required)
            .addChoices(...roleChoices)
        )
    ),
  async execute(interaction) {
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();
    const role = interaction.options.getString('role');

    const data = getData();
    const members = data.members;

    let rouletteUsers = members.filter(user => user.roles.includes(role));
    rouletteUsers = rouletteUsers.filter(user => user.name !== 'bot.exe');
    if (rouletteUsers.length <= 0) {
      console.log("No users found");
      await interaction.reply({ content: "No users found", ephemeral: true });
      return;
    }

    let randomIndex = Math.floor(Math.random() * rouletteUsers.length);
    const displayRole = (role == '@everyone') ? role : '@' + role;

    let message = new EmbedBuilder()
    .setColor(0xdea254)
    .setTitle(`**${capitaliseFirstLetter(subcommand)}** roulette for **${displayRole}**`)
    .setAuthor({ name: 'bot.exe', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
    .setImage(rouletteUsers[randomIndex].pfpUrl)
    .setTimestamp()
	  .setFooter({ text: 'currently rolling...' });

    await interaction.reply({ embeds: [message] });

    for (let tick = 0; tick < config.numRouletteTicks; tick++) {
      randomIndex = Math.floor(Math.random() * rouletteUsers.length);
      await wait(50);

      let newMessage = new EmbedBuilder()
      .setColor(0xdea254)
      .setTitle(`**${capitaliseFirstLetter(subcommand)}** roulette for **${displayRole}**`)
      .setAuthor({ name: 'bot.exe', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
      .setImage(rouletteUsers[randomIndex].pfpUrl)
      .setTimestamp()
      .setFooter({ text: 'currently rolling...' });

      await interaction.editReply({ embeds: [newMessage] });
    }

    if (subcommand === 'ban') {
  
      message = new EmbedBuilder()
      .setColor(0xdea254)
      .setTitle(`**${capitaliseFirstLetter(subcommand)}** roulette for **${displayRole}**`)
      .setAuthor({ name: 'bot.exe', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
      .setImage(rouletteUsers[randomIndex].pfpUrl)
      .setTimestamp()
      .setFooter({ text: `${rouletteUsers[randomIndex].name} has been banned from the server by fate` });

      await interaction.editReply({ embeds: [message] });

      interaction.guild.members.fetch()
        .then((members) => {
          const target = members.find(obj => obj.user.id === rouletteUsers[randomIndex].id);
          if (target.bannable) {
            interaction.guild.members.ban(target.user);
          }
        })

    } else if (subcommand === 'kick') {
      message = new EmbedBuilder()
      .setColor(0xdea254)
      .setTitle(`**${capitaliseFirstLetter(subcommand)}** roulette for **${displayRole}**`)
      .setAuthor({ name: 'bot.exe', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
      .setImage(rouletteUsers[randomIndex].pfpUrl)
      .setTimestamp()
      .setFooter({ text: `${rouletteUsers[randomIndex].name} has been kicked from the server by fate` });

      await interaction.editReply({ embeds: [message] });

      interaction.guild.members.fetch()
        .then((members) => {
          const target = members.find(obj => obj.user.id === rouletteUsers[randomIndex].id);
          if (target.bannable) {
            target.kick();
          }
        })

    } else if (subcommand === 'timeout') {
      let min = config.minRouletteTimeout;
      let max = config.maxRouletteTimeout;
      let timeoutLength = Math.floor(Math.random() * (max - min + 1) + min);
      message = new EmbedBuilder()
      .setColor(0xdea254)
      .setTitle(`**${capitaliseFirstLetter(subcommand)}** roulette for **${displayRole}**`)
      .setAuthor({ name: 'bot.exe', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
      .setImage(rouletteUsers[randomIndex].pfpUrl)
      .setTimestamp()
      .setFooter({ text: `${rouletteUsers[randomIndex].name} has recieved a ${timeoutLength} second timeout` });

      await interaction.editReply({ embeds: [message] });

      interaction.guild.members.fetch()
        .then((members) => {
          const target = members.find(obj => obj.user.id === rouletteUsers[randomIndex].id);
          if (target.bannable) {
            target.timeout(timeoutLength * 1000);
          }
        })
    }

    setData(data);
  },
};

const capitaliseFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

