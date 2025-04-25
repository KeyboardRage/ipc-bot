import type { ServiceMap } from "../../types.js";
import { JWTAuthHandler } from "../server/index.js";
import fastifySocketIO from "./domain/FastifyAdapter.js";
import { Plugin } from "../core/index.js";
import EventBus from "./domain/EventBus.js";
import WSServer from "./domain/WSServer.js";

export {
    WSServer,
    EventBus,
}

export default function() {
    return new Plugin<ServiceMap>("Real Time", {
        load(core) {
            // Register the fastify-socket.io plugin, so that Fastify can be used to establish WS connections
            const server = core.getService("Server");
            server.getInstance().register(fastifySocketIO, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"],
                    credentials: true,
                }
            });

            // Register the event bus
            const eventBus = new EventBus();
            core.registerService("EventBus", eventBus);
        },
        postStart(core) {

            // Register the WSServer as its own service for ease of access
            const ws = core.getService("Server").getInstance().io;
            core.registerService("WebSocket", ws);

            // Enable auth for connecting to the WS
            core.getService("Server")
                .getInstance()
                .io
                .use((socket, next) => {
                    /**
                     * Socket IO does auth weirdly via handshake payload.
                     * So we have to basically take the token from their custom handshake object
                     * and manually put it into the HTTP request headers a bearer token.
                     */
                    if (!socket.handshake?.auth?.token) return next(new Error("Missing token for auth"));
                    socket.request.headers.authorization = `Bearer ${socket.handshake.auth.token}`;

                    /**
                     * Then, we can re-use the auth middleware. However usually Fastify just lets you throw
                     * and they gracefully handle it, but SocketIO does not. If you throw here, it will just
                     * accept it and continue with the authorization as if it was successful.
                     *
                     * Instead we have to pass an error into "next" for it to reject.
                     */
                    try {
                        // @ts-expect-error - It fulfills the type enough for auth
                        JWTAuthHandler(core)(socket.request);
                    } catch(err) {
                        return next(err as Error);
                    }

                    /**
                     * Finally, check if we finally have a user object decorated in the request,
                     * which should have been done by the JWTAuthHandler.
                     */
                    if (!socket.request.user) return next(new Error("Unauthorized"));

                    /**
                     * Now we need to store the user on the web socket itself, so that we can access
                     * it whenever the user emits any events, or when we need to get the current
                     * socket's user details.
                     */
                    socket.user = socket.request.user;
                    next();
                });

            // Some debugging and testing shit
            core.getService("Server").getInstance().io.on("connection", (socket) => {
                console.debug("New WebSocket connection");
                socket.emit("init", {
                    hello: `Hey ${socket.user.username}!`
                });
            });
        },
    });
}