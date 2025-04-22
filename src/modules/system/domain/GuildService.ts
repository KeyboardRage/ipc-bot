import type { IAllGuildIdsOptions, IGuild } from "../types";
import type { APIGuild } from "discord-api-types/v10";
import type { ApplicationCore } from "../../../types";
import type { Guild } from "discord.js";
import type { FilterQuery } from "../../database";

export interface IGuildServiceDependencies {
    core: ApplicationCore
}

export default class GuildService {
    core: ApplicationCore

    constructor(dep: IGuildServiceDependencies) {
        this.core = dep.core;
    }

    #Guilds() {
        return this.core.getService("Database").getModel<IGuild>("Guilds");
    }

    /**
     * Update a guild, or create if it doens't already exist
     */
    async upsertGuild(guild: APIGuild | Guild): Promise<void> {
        // TODO Use MongoDB virtual getters/setters to proxy _id and id

        const data: Partial<IGuild> = {
            _id: guild.id,
            name: guild.name,
            // @ts-expect-error - Former exists on APIGuild, latter on Guild
            owner_id: guild.owner_id || guild.ownerId,
        };

        await this.#Guilds().updateOne(
            { _id: data._id },
            { $set: data, $unset: { leftAt: 1 } },
            { upsert: true },
        );
    }

    /**
     * Register that a the bot was removed from or left a guild
     */
    markLeftGuild(guildId: string) {
        this.#Guilds().updateOne(
            { _id: guildId },
            { $set: { leftAt: new Date() } },
        );
    }

    /**
     * Return a list of guild IDs the bot is currently in
     */
    async allGuildsIds(options: IAllGuildIdsOptions = {}) {
        const query: FilterQuery<IGuild> = { leftAt: null };
        if (options.exceptIds) query._id = { $nin: options.exceptIds };

        const r = await this.#Guilds().find(query, ["_id"]).lean().exec();
        return r.map(g => g._id);
    }

    /**
     * Collects all the broadcast channels
     */
    async getBroadcastChannels(options: IAllGuildIdsOptions = {}): Promise<string[]> {
        const query: FilterQuery<IGuild> = { leftAt: null, channelId: { $ne: null}, broadcastEnabled: true };
        if (options.exceptIds) query._id = { $nin: options.exceptIds };

        const r = await this.#Guilds().find(query, ["channelId"]).lean().exec();
        return r.map(g => g.channelId) as string[];
    }

    /**
     * Set/unset the broadcast channel for a guild
     */
    async setBroadcastChannel(guildId: string, channelId: null | string): Promise<void> {
        await this.#Guilds().updateOne(
            { _id: guildId },
            { $set: { channelId } },
        );
    }

    /**
     * Sets whether the guild wants to receive broadcasts or not
     */
    async setBroadcastEnabled(guildId: string, enabled: boolean): Promise<void> {
        await this.#Guilds().updateOne(
            { _id: guildId },
            { $set: { broadcastEnabled: enabled } },
        );
    }
}