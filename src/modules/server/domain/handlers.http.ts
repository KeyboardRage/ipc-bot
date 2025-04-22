import type { GuildService } from "../../system";
import type { IUserData } from "../../../types.ts";
import type { DiscordService } from "../../rest";

interface IPostBroadcastMessageData {
    content: string;
}
export async function PostBroadcastMessage(guilds: GuildService, discord: DiscordService, user: IUserData, data: IPostBroadcastMessageData) {
    const channelIds = await guilds.getBroadcastChannels();
    discord.queueBulkSend(channelIds, {content: data.content});

    return {
        success: true,
        user,
    };
}