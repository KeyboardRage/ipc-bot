import type { ServiceMap } from "../../types";
import Server from "./domain/Server";
import Plugin from "../core/domain/Plugin";
import JWTAuthHandler from "../auth/domain/JWTAuthHandler";
import RoutesFactory from "./entry-point/http/index";

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