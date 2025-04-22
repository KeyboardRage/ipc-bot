import { Client, type ClientOptions } from "discord.js";

export default class BotClient extends Client {
    constructor(options: ClientOptions) {
        super(options);
    }

    start() {
        return this.login(process.env.BOT_TOKEN);
    }
}