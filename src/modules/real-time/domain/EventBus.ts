import type { IOSocket } from "../types.js";
import type { RealTimeDB } from "../../database/index.js";
import { BaseComponent } from "../../core/index.js";
import { r } from "rethinkdb-ts";

/**
 * A dedicated handler for distributing events that the API knows about to relevant connected users.
 */
export default class LiveManager extends BaseComponent<{}> {
    #clients = new Map<string, IOSocket[]>();
    #rdb: RealTimeDB;

    constructor(db: RealTimeDB) {
        super();
        this.#rdb = db;

        /**
         * A simple cleanup mechanism that removes empty user socket arrays
         * for as long as the entire API is running.
         */
        setInterval(()=>{
            for (const [userId, sockets] of this.#clients.entries()) {
                if (sockets.length === 0) this.#clients.delete(userId);
            }
        }, 60_000); // Cleanup every 1 minute
    }

    attachListeners() {
        // Set up subscriptions to database changes
        r.table("DiscordUsers").changes().run(this.#rdb.db).then(cursor => {
            cursor.each((err, row) => {
                if (err) return console.error(err);
                this.newEventFor(row.new_val.id, "user.update", row.new_val);
            });
        });
    }

    /**
     * Ensures that there's an array of sockets for the userId
     * @param userId Discord user ID
     * @private
     */
    #ensureClient(userId: string) {
        if (!this.#clients.has(userId)) {
            this.#clients.set(userId, []);
        }
    }

    /**
     * Registers a new user that connected via WebSocket
     * @param userId The Discord user's ID
     * @param socket The SocketIO socket instance created for this connection
     */
    clientConnected(userId: string, socket: IOSocket) {
        this.#ensureClient(userId);
        this.#clients.get(userId)!.push(socket);
    }

    /**
     * Registers a user disconnected from the websocket, e.g., closed the page or went AFK
     * @param userId The Discord user's ID that disconnected
     * @param socket The specific socket for this user's e.g., browser tab
     */
    clientDisconnected(userId: string, socket: IOSocket) {
        if (!this.#clients.has(userId)) return;

        const sockets = this.#clients.get(userId)!;
        const index = sockets.indexOf(socket);
        if (index !== -1) sockets.splice(index, 1);
    }

    /**
     * There's a new event/new data available for user by ID
     * @param userId The Discord user ID
     * @param eventType The type of event, e.g. "account.updated"
     * @param eventPayload The data to send to the user, e.g., their new account data: {username: "username", globalName: "My Name"}
     */
    newEventFor(userId: string, eventType: string, eventPayload: any) {
        if (!this.#clients.has(userId)) return;

        const sockets = this.#clients.get(userId)!;
        for (const socket of sockets) {
            socket.emit(eventType, eventPayload);
        }
    }

    /**
     * A new socket event for all users
     * @param eventType The type of event, e.g. "site.updateAvailable"
     * @param eventPayload The data to send to the user, e.g., the new version of the site: {version: "1.3.2", url: "https://cyberac.me"}
     */
    newEventForEveryone(eventType: string, eventPayload: any) {
        for (const sockets of this.#clients.values()) {
            for (const socket of sockets) {
                socket.emit(eventType, eventPayload);
            }
        }
    }
}

