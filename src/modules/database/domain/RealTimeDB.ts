import type { Connection, RConnectionOptions } from "rethinkdb-ts";
import { r } from "rethinkdb-ts";

export default class RealTimeDB {
    #db?: Connection;

    /**
     * Get the database connection
     */
    get db(): Connection {
        if (!this.#db) throw new Error("Database not initialized yet");
        return this.#db;
    }

    /**
     * Start the database connection
     */
    async start(options: RConnectionOptions) {
        this.#db = await r.connect(options);
        this.#db.use(process.env.NODE_ENV as string || "development");
    }

    /**
     * Close the database connection
     * @param force Close by force/noreplyWait
     */
    async stop(force?: boolean ) {
        if (this.#db) {
            await this.#db.close({ noreplyWait: !!force });
            this.#db = undefined;
        }
    }
}