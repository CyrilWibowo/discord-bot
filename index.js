const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Intents } = require('discord.js');
const { token, commandsRequireRestart, guildId } = require('./config.json');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { getData, setData } = require('./data.js');

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
]

const client = new Client({ intents: intents });

const setCommands = (commandFolders, foldersPath, client) => {
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
setCommands(commandFolders, foldersPath, client);

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	const guild = client.guilds.cache.get(guildId);
	if (guild) {
		let data = getData();

		const roles = guild.roles.cache;
		// Log role information
		const rolesArray = roles.map(role => ({
			name: role.name,
			id: role.id
		}))

		// console.log('Roles data in the server:', rolesArray);
		data.roles = rolesArray;

		guild.members.fetch()
			.then((members) => {
				// console.log(members);
				const memberData = members.map(member => ({
					name: member.user.username,
					id: member.user.id,
					roles: member.roles.cache.map(role => role.name),
					pfpUrl: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 64 })
				}));
				// console.log('Members data in the server:', memberData);

				data.members = memberData;
				setData(data);
			})
			.catch(error => {
				console.error('Error fetching members:', error);
			});
		
		setData(data);
	}
});

client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
		updateIfRequire(command.data.name);

	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.login(token);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const updateIfRequire = async (commandName) => {
	if (commandsRequireRestart.includes(commandName)) {
		setCommands(commandFolders, foldersPath, client);
		try {
			const { stdout, stderr } = await exec("node deploy-commands.js");
			console.log('Command executed successfully:\n', stdout);
			if (stderr) {
				console.error('Error during command execution:', stderr);
			}
		} catch (error) {
			console.error('Error executing command:', error.message);
		}
	}
}

const setRoullete = (commandName) => {
	// console.log(commandName);
}
