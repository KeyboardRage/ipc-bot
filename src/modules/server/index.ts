import type { ServiceMap } from "../../types.js";
import Server from "./domain/Server.js";
import Plugin from "../core/domain/Plugin.js";
import JWTAuthHandler from "../auth/domain/JWTAuthHandler.js";
import RoutesFactory from "./entry-point/http/index.js";

export {
    Server,
    JWTAuthHandler,
};

export default function () {
    return new Plugin<ServiceMap>("HTTP Server", {
        load(core) {
            const server = new Server();
            core.registerService("Server", server);

            // Register HTTP routes
            server.registerRoute(RoutesFactory);
        },
        postLoad(core) {
            core.getService("Server").loadRoutes(core);
        },
        async start(core) {
            await core.getService("Server").start();
        }
    });
}