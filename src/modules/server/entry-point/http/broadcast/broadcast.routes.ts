import type { HTTPServer, Route } from "../../../types.js";
import type * as POSTBroadcastMessage from "./_spec/POSTBroadcastMessage.js";
import { PostBroadcastOptions } from "./broadcast.helpers.js";
import * as handlers from "../../../domain/handlers.http.js";

// /v1/broadcast
const MakeRoutes: Route<HTTPServer> = (server, opts, done) => {
    server.post<POSTBroadcastMessage.RequestTypes>("/", PostBroadcastOptions, (req) => {
        return handlers.PostBroadcastMessage(
            server.core.getService("Guilds"),
            server.core.getService("Discord"),
            req.user,
            {
                content: req.body.content,
            },
        );
    });

    done();
}

export default MakeRoutes;