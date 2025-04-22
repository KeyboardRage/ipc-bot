import type { HTTPServer, Route } from "../../../types";
import type * as POSTBroadcastMessage from "./_spec/POSTBroadcastMessage";
import { PostBroadcastOptions } from "./broadcast.helpers.ts";
import * as handlers from "../../../domain/handlers.http";

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