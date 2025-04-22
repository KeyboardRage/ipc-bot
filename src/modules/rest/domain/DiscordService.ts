import type { IDiscordServiceDependencies } from "../types.js";
import type { ApplicationCore } from "../../../types.js";
import { BaseComponent } from "../../core/index.js";
import {Routes} from "discord-api-types/v10";

export default class DiscordService extends BaseComponent<{}> {
    core: ApplicationCore;
    queue: {channelId: string, payload: any}[] = [];

    constructor(dep: IDiscordServiceDependencies) {
        super();
        this.core = dep.core;
    }

    start() {
        setInterval(() => {
            while(this.queue.length) {
                const next = this.queue.shift();
                console.log("Next in queue", next);
                if (!next) return;

                this.sendMessage(next.channelId, next.payload).catch(console.error);
            }
        }, 10);
    }

    get rest() {
        return this.core.getService("REST")
    }

    /**
     * Sends a message to a given channel
     */
    sendMessage(channelId: string, payload: any) {
        return this.rest.post(Routes.channelMessages(channelId), { body: payload });
    }

    /**
     * Queues a message for broadcasting to the target channels
     */
    queueBulkSend(channelIds: string[], payload: any) {
        this.queue.push(
            ...channelIds.map(ch => ({
                channelId: ch,
                payload,
            }))
        );
    }
}