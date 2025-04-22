import type { ServiceMap } from "../../types.js";
import RestClient from "./domain/RestClient.js";
import Plugin from "../core/domain/Plugin.js";
import DiscordService from "./domain/DiscordService.js";

export {
    RestClient,
    DiscordService,
};

export default function() {
    return new Plugin<ServiceMap>("REST Client", {
        load(core) {
            const client = new RestClient({
                version: "10",
            }).setToken(process.env.BOT_TOKEN);
            core.registerService("REST", client);

            const discord = new DiscordService({ core });
            core.registerService("Discord", discord);
        },
        ready(core) {
            // Start processing message broadcast queue
            core.getService("Discord").start();
        }
    });
}