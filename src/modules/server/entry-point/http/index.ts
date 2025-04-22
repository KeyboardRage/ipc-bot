import type { HTTPServer, Route } from "../../types.js";
import { JWTAuthHandler } from "../../index.js";
import Broadcast from "./broadcast/broadcast.routes.js";

// Root
const MakeRoutes: Route<HTTPServer> = (server, opts, done) => {
    const handler = JWTAuthHandler(server.core);

    // Provide access to JWT Auth handler to all routes registered from this file
    server.core.getService("Server").useAuth(JWTAuthHandler(server.core));

    // Simple test endpoint
    server.get("/", () => {
        return {ok: true};
    });

    server.register(Broadcast, { prefix: "/v1/broadcast" });

    done();
}

export default MakeRoutes;