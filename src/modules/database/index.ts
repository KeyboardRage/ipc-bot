import type { ServiceMap } from "../../types";
import Plugin from "../core/domain/Plugin";
import Database from "./domain/Database";
import DocSchema from "./domain/DocSchema";

export * from "./types";
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