import type { ServiceMap } from "../../types";
import { GatewayIntentBits } from "discord.js";
import BotClient from "./domain/BotClient";
import Plugin from "../core/domain/Plugin";

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