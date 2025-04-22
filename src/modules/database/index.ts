import type { ServiceMap } from "../../types.js";
import Plugin from "../core/domain/Plugin.js";
import Database from "./domain/Database.js";
import DocSchema from "./domain/DocSchema.js";

export * from "./types.js";
export {
    Database,
    DocSchema,
};

export default function() {
    return new Plugin<ServiceMap>("Database", {
        load(core) {
            const db = new Database({
                config: {
                    autoIndex: true,
                    maxPoolSize: 10,
                },
            });

            core.registerService("Database", db);
        }
    });
}