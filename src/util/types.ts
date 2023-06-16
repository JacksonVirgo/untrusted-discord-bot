import { ChannelType, GuildBasedChannel, TextChannel } from 'discord.js';

export function isTextChannelWithParent(channel: GuildBasedChannel): channel is TextChannel {
	if (channel.type != ChannelType.GuildText) return false;
	if (!('parentId' in channel)) return false;
	if (!channel.parentId) return false;

	return true;
}
