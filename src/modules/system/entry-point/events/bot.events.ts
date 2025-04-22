import type { ApplicationCore } from "../../../../types";
import BotClient from "../../../client/domain/BotClient";

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