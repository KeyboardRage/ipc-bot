import type { ServiceMap } from "../../types.js";
import { GatewayIntentBits } from "discord.js";
import BotClient from "./domain/BotClient.js";
import Plugin from "../core/domain/Plugin.js";
import { r } from "rethinkdb-ts";

export {
    BotClient,
};

export default function() {
    return new Plugin<ServiceMap>("Discord Bot Client", {
        load(core) {
            const client =  new BotClient({
                intents: [
                    // Needed to see guild members
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMembers,

                    // Needed for reading message content to calculate XP gain
                    GatewayIntentBits.MessageContent,
                    GatewayIntentBits.GuildMessages,

                    // Needed for guild profile updates:
                    GatewayIntentBits.GuildPresences,
                ]
            });

            core.registerService("Bot", client);
        },
        async start(core) {
            await core.getService("Bot").start();
        },
        ready(core) {
            const RealTime = core.getService("RealTime");
            core.getService("Bot").on("guildMemberUpdate", async (oldMember, newMember) => {
                RealTime.upsertUser({
                    id: newMember.user.id,
                    nickname: newMember.nickname,
                    username: newMember.user.username,
                    globalName: newMember.user.globalName,
                    avatar: newMember.avatar || newMember.user.avatar,
                });
            });
            core.getService("Bot").on("userUpdate", (oldUser, newUser) => {
                console.log("User updated", oldUser, newUser);
            });
            core.getService("Bot").on("messageCreate", (message) => {
                console.log("Message created", message);
            });
        }
    });
}