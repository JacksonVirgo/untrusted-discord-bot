import { Account as RawAccount } from '@prisma/client';
import { prisma } from '../database';
import { ColorResolvable, Colors, EmbedBuilder, Guild } from 'discord.js';
import { getAverageColor } from 'fast-average-color-node';

export async function getAccount(userId: string) {
	try {
		const account = await prisma.account.findUniqueOrThrow({
			where: {
				discordId: userId,
			},
		});

		return account;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export type Account = NonNullable<Awaited<ReturnType<typeof getAccount>>>;

export async function formatAccountEmbed(account: Account, guild: Guild) {
	await guild.members.fetch();
	const member = guild.members.cache.get(account.discordId);
	if (!member) return null;

	const embed = new EmbedBuilder();
	embed.setTitle(`${member.displayName}'s Account`);
	embed.setColor(Colors.White);
	embed.addFields(
		{
			name: 'NetCoins',
			value: `> ${account.netCoins}`,
			inline: true,
		},
		{
			name: 'OccuCoins',
			value: `> ${account.occuCoins}`,
			inline: true,
		}
	);

	const avatarURL = member.user.displayAvatarURL({});
	const color = await getAverageColor(avatarURL);
	embed.setColor(color.hex as ColorResolvable);
	embed.setThumbnail(avatarURL);

	return embed;
}
