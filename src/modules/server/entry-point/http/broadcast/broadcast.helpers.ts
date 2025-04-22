import { RouteOpts } from "../../../types";
import * as POSTBroadcastMessage from "./_spec/POSTBroadcastMessage";

export const PostBroadcastOptions: RouteOpts = {
    config: { jwtAuth: true },
    schema: {
        body: POSTBroadcastMessage.body,
        headers: POSTBroadcastMessage.headers,
    },
};