import type { ServiceMap } from "../../types.js";
import { GatewayIntentBits } from "discord.js";
import BotClient from "./domain/BotClient.js";
import Plugin from "../core/domain/Plugin.js";

export {
    BotClient,
};

export default function() {
    return new Plugin<ServiceMap>("Discord Bot Client", {
        load(core) {
            const client =  new BotClient({
                intents: [
                    GatewayIntentBits.Guilds,
                ]
            });

            core.registerService("Bot", client);
        },
        async start(core) {
            await core.getService("Bot").start();
        }
    });
}