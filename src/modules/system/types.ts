import type { APIGuild } from "discord-api-types/v10";

export interface IGuild extends Pick<APIGuild, "name"|"owner_id"> {
    /**
     * Guild ID
     */
    _id: string;

    /**
     * the date the bot was removed from this server/left it
     */
    leftAt?: Date;

    /**
     * The ID of the channel the guild wants broadcasts to be dispatched to.
     * Is not set if not configured.
     */
    channelId?: string;

    /**
     * Whether the guild wants to receive broadcasts or not.
     */
    broadcastEnabled: boolean;
}

export interface IAllGuildIdsOptions {
    /**
     * Do not return these guild IDs
     */
    exceptIds?: string[];
}