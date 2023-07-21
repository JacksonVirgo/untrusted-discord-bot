import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import config from '../../config';
import { formatAccountEmbed, getAccount } from '../../util/account';

const data = new SlashCommandBuilder().setName('view').setDescription('View something (very descriptive)');

data.addSubcommand((sub) =>
	sub
		.setName('account')
		.setDescription('View the account of a user')
		.addUserOption((opt) => opt.setName('user').setDescription('The user to create an account for').setRequired(true))
		.addBooleanOption((opt) => opt.setName('hidden').setDescription('View this profile just for yourself').setRequired(false))
);

export default newSlashCommand({
	data,
	mainServer: true,
	execute: async (i: ChatInputCommandInteraction) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });		
		switch (i.options.getSubcommand(true)) {
			case 'account':
				return viewAccount(i);
			default:
				return i.reply({ content: 'Invalid subcommand', ephemeral: true });
		}
	},
});

async function viewAccount(i: ChatInputCommandInteraction) {
	if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });
	const user = i.options.getUser('user', true);
	const hidden = i.options.getBoolean('hidden', false) ?? false;

	await i.deferReply({ ephemeral: hidden });

	try {
		const account = await getAccount(user.id);
		if (!account) return await i.editReply({ content: 'This user does not have a profile' });

		const embed = await formatAccountEmbed(account, i.guild);
		if (!embed) return await i.editReply({ content: 'This user does not have a profile' });

		return await i.editReply({ embeds: [embed] });
	} catch (err) {
		console.log(err);
		return await i.editReply({ content: 'An error occurred' });
	}
}
