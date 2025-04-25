import type { ServiceMap } from "../../types.js";
import { Plugin } from "../core/index.js";

/**
 * Services and utilities only available in local development mode.
 */
export default function() {
    if (process.env.NODE_ENV !== "development") throw new Error("This module is not supposed to be loaded in any other environment than development.");

    return new Plugin<ServiceMap>("Development Environment Utils", {
        load(core) {
            // Temporary: a basic route to generate a JWT for you
            core.getService("Server").registerRoute((server, opts, done) => {
                server.post("/dev/generate-jwt", (req) => {
                    // @ts-expect-error - I don't care, this is a test
                    return core.getService("Auth").createKey(req.body);
                });

                return done();
            });
        },
    });
}