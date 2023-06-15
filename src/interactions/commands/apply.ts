import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { newSlashCommand } from '../../structures/BotClient';
import { prisma } from '../../database';
import config from '../../config';

const data = new SlashCommandBuilder().setName('apply').setDescription('Give someone access to a specific name and avatar.');
data.addUserOption((option) => option.setName('user').setDescription('The user to apply the name and avatar to').setRequired(true));
data.addChannelOption((option) =>
	option
		.setName('category')
		.setDescription('The category to create the channel in')
		.addChannelTypes(ChannelType.GuildCategory)

		.setRequired(true)
);

data.addStringOption((option) => option.setName('name').setDescription('The name to apply').setRequired(true));
data.addStringOption((option) => option.setName('avatar').setDescription('The avatar to apply').setRequired(false));
data.addBooleanOption((opt) => opt.setName('broadcast').setDescription('Can broadcast publicly (but anonymously)').setRequired(false));

data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export default newSlashCommand({
	data,
	execute: async (i) => {
		if (!i.guild) return i.reply({ content: 'This command can only be used in a server', ephemeral: true });
		if (i.guildId !== config.MAIN_SERVER_ID) return i.reply({ content: 'This command can only be used in the main server', ephemeral: true });

		const user = i.options.getUser('user', true);
		const name = i.options.getString('name', true);
		const avatar = i.options.getString('avatar', false) ?? undefined;
		const cateogry = i.options.getChannel('category', true);

		if (cateogry.type !== ChannelType.GuildCategory) return i.reply({ content: 'The selected category must be a category', ephemeral: true });

		try {
			const fetchedUser = await prisma.profile.findUnique({
				where: {
					accountId_categoryId: {
						accountId: user.id,
						categoryId: cateogry.id,
					},
				},
			});

			if (fetchedUser) {
				return i.reply({ content: 'This name is already taken OR this user already has a profile', ephemeral: true });
			}

			await prisma.profile.create({
				data: {
					discordAccount: {
						connectOrCreate: {
							where: {
								discordId: user.id,
							},
							create: {
								discordId: user.id,
							},
						},
					},
					categoryId: cateogry.id,
					name: name,
					avatarURL: avatar,
				},
			});

			return i.reply({
				content: `${user.username} has been applied to ${name}`,
				ephemeral: true,
			});
		} catch (error) {
			console.log(error);
			return i.reply({
				content: `An error occured. Make sure that you're using a valid game tag and all the fields (name, avatar etc) are valid.`,
				ephemeral: true,
			});
		}
	},
});
