import type { ServiceMap } from "../../types.js";
import Plugin from "../core/domain/Plugin.js";
import GuildService from "./domain/GuildService.js";
import BotEventHandlers from "./entry-point/events/bot.events.js";
import GuildSchema from "./data-access/schemas/GuildSchema.js";

export * from "./types.js";
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