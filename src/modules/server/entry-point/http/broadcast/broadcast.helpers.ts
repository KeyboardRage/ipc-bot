import { RouteOpts } from "../../../types.js";
import * as POSTBroadcastMessage from "./_spec/POSTBroadcastMessage.js";

export const PostBroadcastOptions: RouteOpts = {
    config: { jwtAuth: true },
    schema: {
        body: POSTBroadcastMessage.body,
        headers: POSTBroadcastMessage.headers,
    },
};