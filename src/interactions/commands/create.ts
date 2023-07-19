import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CustomInteraction, newSlashCommand } from '../../structures/BotClient';
import config from '../../config';
import { prisma } from '../../database';

const data = new SlashCommandBuilder().setName('create').setDescription('[ADMIN] Create a value in the database');

data.addSubcommand((sub) =>
	sub
		.setName('account')
		.setDescription('Create an account, if one does not already exist')
		.addUserOption((opt) => opt.setName('user').setDescription('The user to create an account for').setRequired(true))
		.addIntegerOption((opt) => opt.setName('netcoins').setDescription('The amount of netcoins to give the user').setRequired(false))
		.addIntegerOption((opt) => opt.setName('occucoins').setDescription('The amount of occucoins to give the user').setRequired(false))
);

data.addSubcommand((sub) =>
	sub
		.setName('transaction')
		.setDescription('Create a transaction on an account')
		.addUserOption((user) => user.setName('user').setDescription('The account to create a transaction for').setRequired(true))
		.addStringOption((opt) => opt.setName('reason').setDescription('The reason for the transaction').setRequired(true))
		.addIntegerOption((opt) => opt.setName('netcoins').setDescription('The amount of netcoins to give the user (use - to take)').setRequired(false))
		.addIntegerOption((opt) => opt.setName('occucoins').setDescription('The amount of occucoins to give the user (use - to take)').setRequired(false))
);

export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });
		if (i.guildId !== config.MAIN_SERVER_ID) return i.reply({ content: 'This command can only be used in the main server', ephemeral: true });

		await i.guild.members.fetch();
		const member = i.guild.members.cache.get(i.user.id);
		if (!member) return i.reply({ content: 'You are not in the server', ephemeral: true });

		// Check if user is an ADMIN
		if (!member.permissions.has('Administrator')) return i.reply({ content: 'You do not have permission to use this command', ephemeral: true });

		switch (i.options.getSubcommand(true)) {
			case 'account':
				return createAccount(i);
			case 'transaction':
				return createTransaction(i);
			default:
				return i.reply({ content: 'Invalid subcommand', ephemeral: true });
		}
	},
});

async function createAccount(i: ChatInputCommandInteraction) {
	const user = i.options.getUser('user', true);
	const netCoins = i.options.getInteger('netcoins', false) ?? 0;
	const occuCoins = i.options.getInteger('occucoins', false) ?? 0;

	await i.deferReply({ ephemeral: true });
	try {
		const account = await prisma.account.findUnique({
			where: {
				discordId: user.id,
			},
		});

		if (account) return await i.editReply({ content: 'This user already has an account' });

		const createdAccount = await prisma.account.create({
			data: {
				discordId: user.id,
				netCoins: netCoins,
				occuCoins: occuCoins,
			},
		});

		return await i.editReply({ content: `Created account for <@${createdAccount.discordId}>` });
	} catch (err) {
		console.log(err);
		return await i.editReply({ content: 'An error occurred' });
	}
}

async function createTransaction(i: ChatInputCommandInteraction) {
	const user = i.options.getUser('user', true);
	const netCoins = i.options.getInteger('netcoins', false) ?? 0;
	const occuCoins = i.options.getInteger('occucoins', false) ?? 0;
	const reason = i.options.getString('reason', true);

	await i.deferReply({ ephemeral: true });

	try {
		const adminAccount = await prisma.account.findUnique({
			where: {
				discordId: i.user.id,
			},
		});
		if (!adminAccount) return await i.editReply({ content: '__You__ do not have an account. This is required to track who initiated this transaction' });

		const account = await prisma.account.findUnique({
			where: {
				discordId: user.id,
			},
		});

		if (!account) return await i.editReply({ content: 'This user does not have an account' });

		await prisma.account.update({
			where: { id: account.id },
			data: {
				netCoins: account.netCoins + netCoins,
				occuCoins: account.occuCoins + occuCoins,
			},
		});

		await prisma.transaction.create({
			data: {
				accountId: account.id,
				adminId: adminAccount.id,
				netCoinChange: account.netCoins - (account.netCoins + netCoins),
				occuCoinChange: account.occuCoins - (account.occuCoins + occuCoins),
				reason: reason,
			},
		});

		return await i.editReply({ content: `Created transaction for <@${account.discordId}>` });
	} catch (err) {
		console.log(err);
		return await i.editReply({ content: 'An error occurred' });
	}
}
