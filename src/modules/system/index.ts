import type { ServiceMap } from "../../types";
import Plugin from "../core/domain/Plugin";
import GuildService from "./domain/GuildService";
import BotEventHandlers from "./entry-point/events/bot.events";
import GuildSchema from "./data-access/schemas/GuildSchema";

export * from "./types";
export {
    GuildService,
};

export default function() {
    return new Plugin<ServiceMap>("Main System", {
        load(core) {
            const guilds = new GuildService({ core });
            core.registerService("Guilds", guilds);

            // Register schemas
            core.getService("Database").registerModel("Guilds", GuildSchema);

            // Set up bot event handlers
            BotEventHandlers(core.getService("Bot"), core);
        },
    });
}