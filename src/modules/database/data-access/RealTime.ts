import type { IUserData } from "../../../types.js";
import type { Connection } from "rethinkdb-ts";
import type { EventBus } from "../../real-time/index.js";
import { r } from "rethinkdb-ts";

export default class RealTimeQueries {
    #db: Connection;
    #eventBus: EventBus;

    constructor(db: Connection, eventBus: EventBus) {
        this.#db = db;
        this.#eventBus = eventBus;
    }

    getDiscordUser(userId: string): IUserData {
        return {} as IUserData;
    }

    /**
     * Insert or update a user record
     */
    async upsertUser(user: IUserData) {
        await r.table("DiscordUsers").insert(user, { conflict: "update" }).run(this.#db);
    }
}