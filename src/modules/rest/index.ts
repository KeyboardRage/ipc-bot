import type { ServiceMap } from "../../types";
import RestClient from "./domain/RestClient";
import Plugin from "../core/domain/Plugin";
import DiscordService from "./domain/DiscordService.ts";

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