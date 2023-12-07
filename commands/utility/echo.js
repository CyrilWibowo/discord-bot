const { SlashCommandBuilder, Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Echos your message!')
    .addStringOption(option =>
			option
				.setName('message')
				.setDescription('Message you want to echo')
        .setRequired(true)),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    await interaction.reply(`${message}`);
  },
};