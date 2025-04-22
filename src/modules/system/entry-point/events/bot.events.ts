import type { ApplicationCore } from "../../../../types.js";
import BotClient from "../../../client/domain/BotClient.js";

export default function(bot: BotClient, core: ApplicationCore) {
    // Bot joined guild
    bot.on("guildCreate", (guild) => {
        console.log("Guild created", guild);
        return core.getService("Guilds").upsertGuild(guild)
    });

    // Bot left guild
    bot.on("guildDelete", (guild) => {
        return core.getService("Guilds").markLeftGuild(guild.id);
    });
}