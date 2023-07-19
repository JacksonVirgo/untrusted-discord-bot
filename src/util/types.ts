import { channel } from 'diagnostics_channel';
import {
	APIInteractionDataResolvedChannel,
	CategoryChannel,
	ChannelType,
	ForumChannel,
	GuildBasedChannel,
	NewsChannel,
	PrivateThreadChannel,
	PublicThreadChannel,
	StageChannel,
	TextChannel,
	VoiceChannel,
} from 'discord.js';

export function isTextChannelWithParent(channel: GuildBasedChannel): channel is TextChannel {
	if (channel.type != ChannelType.GuildText) return false;
	if (!('parentId' in channel)) return false;
	if (!channel.parentId) return false;

	return true;
}

type EveryChannel = CategoryChannel | NewsChannel | StageChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel<boolean> | VoiceChannel | ForumChannel | APIInteractionDataResolvedChannel;

export function isTextChannel(channel: EveryChannel): channel is TextChannel {
	return channel.type == ChannelType.GuildText;
}

export function isCategory(channel: EveryChannel): channel is CategoryChannel {
	return channel.type == ChannelType.GuildCategory;
}

export type Extension<T, E> = T & E;
export type NonNullable<T> = T extends null | undefined ? never : T;
