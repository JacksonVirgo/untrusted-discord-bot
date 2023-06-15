import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CategoryChannel,
	ChannelType,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import config from '../../config';

const data = new SlashCommandBuilder().setName('update').setDescription("Update someone's access to a specific name and avatar.");
data.addUserOption((option) => option.setName('user').setDescription('The user to apply the name and avatar to').setRequired(true));
data.addChannelOption((option) =>
	option
		.setName('category')
		.setDescription('The category to create the channel in')
		.addChannelTypes(ChannelType.GuildCategory)

		.setRequired(true)
);

data.addStringOption((option) => option.setName('name').setDescription('The name to apply'));
data.addStringOption((option) => option.setName('avatar').setDescription('The avatar to apply').setRequired(false));
data.addBooleanOption((opt) => opt.setName('broadcast').setDescription('Can broadcast publicly (but anonymously)').setRequired(false));

data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });
		if (i.guildId !== config.MAIN_SERVER_ID) return i.reply({ content: 'This command can only be used in the main server', ephemeral: true });

		const user = i.options.getUser('user', true);
		const name = i.options.getString('name', false) ?? undefined;
		const avatar = i.options.getString('avatar', false) ?? undefined;
		const broadcast = i.options.getBoolean('broadcast', false) ?? false;
		const category = i.options.getChannel('category', true);

		await i.deferReply({ ephemeral: true });

		if (!name && !avatar && !broadcast) {
			return i.editReply({ content: 'You must provide a name, avatar or broadcast' });
		}

		const fetchedUser = await prisma.profile.findUnique({
			where: {
				accountId_categoryId: {
					accountId: user.id,
					categoryId: category.id,
				},
			},
		});

		if (!fetchedUser) return i.editReply({ content: 'This user does not have an anonymous profile' });

		const nameOverlap = await prisma.profile.findFirst({ where: { name: name } });
		if (nameOverlap && nameOverlap.name == name) return i.editReply({ content: 'This name is already taken' });

		await prisma.profile.update({
			where: {
				accountId_categoryId: {
					accountId: user.id,
					categoryId: category.id,
				},
			},
			data: {
				name: name,
				avatarURL: avatar,
				canBroadcast: broadcast,
			},
		});

		return i.editReply({
			content: `${user.username} has been updated`,
		});
	},
});
