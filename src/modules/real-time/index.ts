import type { ServiceMap } from "../../types.js";
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
            const auth = core.getService("Auth");
            core.getService("Server").getInstance().io.use((socket, next) => {
                const token = socket.handshake.auth.token;
                const userData = auth.parse(token);

                // If null, it was invalid JWT, else it is the user object
                if (userData === null) next(new Error("Invalid JWT"));

                // TODO USe the Fastify request; it has a `user` on the request ready for decoration.
                // @ts-expect-error - Shitty way of storing user somehow.
                socket.user = userData;
                return next();
            });

            // Some debugging and testing shit
            core.getService("Server").getInstance().io.on("connection", (socket) => {
                console.debug("New WebSocket connection");
                // @ts-expect-error - Ignore the value we manually set for now
                const user = socket.user;
                socket.emit("init", {
                    hello: `Hey ${user.username}!`
                });
            });
        },
    });
}