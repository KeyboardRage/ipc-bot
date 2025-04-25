import type { ServiceMap } from "../../types.js";
import Plugin from "../core/domain/Plugin.js";
import RealTimeQueries from "./data-access/RealTime.js";
import Database from "./domain/Database.js";
import DocSchema from "./domain/DocSchema.js";
import RealTimeDB from "./domain/RealTimeDB.js";

export * from "./types.js";
export {
    Database,
    DocSchema,
    RealTimeDB,
    RealTimeQueries,
};

export default function() {
    return new Plugin<ServiceMap>("Database", {
        load(core) {
            const docDb = new Database({
                config: {
                    autoIndex: true,
                    maxPoolSize: 10,
                },
            });
            core.registerService("Database", docDb);

            const realTimeDb = new RealTimeDB();
            core.registerService("RealTimeDB", realTimeDb);
        },
        async start(core) {
            // Connect to the realtime database
            await core.getService("RealTimeDB").start({
                server: {
                    host: "127.0.0.1",
                    // Not needed as we'll only do internal connection to local service
                    tls: false,
                    // Port is usually 28015, but when using Docker I bound it to 8090
                    port: 8090,
                }
            });

            // Set up a query controller
            const realTime = new RealTimeQueries(
                core.getService("RealTimeDB").db,
                core.getService("EventBus"),
            );
            core.registerService("RealTime", realTime);
        },
        async stop(core, force) {
            await Promise.allSettled([
                core.getService("RealTimeDB").stop(force),
                core.getService("Database").stop(force),
            ]);
        }
    });
}